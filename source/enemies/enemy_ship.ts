import { STAGE, SCALE, WORLD, GAME_WIDTH, GAME_HEIGHT } from "../main.js";
import * as ZIndex from "../z_index.js";
import * as GameStatistics from "../menus/game_statistics.js";
import {
    CollisionID,
    CATEGORY,
    MASK,
    CollisionElement,
} from "../game/collision_detection.js";
import { b2Vec2 } from "../shared/constants.js";

export type EnemyShipArgs = {
    x: number;
    y: number;
    width: number;
    height: number;
};

/*
    Don't use directly, use as a base class, and write these functions:

    --- to the prototype ---

        .makeShape()
        .setupPhysics()
        .enemyBehaviour()
        .updateShape()          (optional)
        .tookDamage()           (optional)
        .beforeAddToStage()     (optional)

    and change these properties:

        .damage
        .velocity
        .width
        .height
        .category_bits
        .mask_bits

    Add reference of the drawn element to:

        .shape

    Physics body

        .body
        .fixDef

 */
export default abstract class EnemyShip<Args extends EnemyShipArgs>
    implements CollisionElement {
    static all = [];
    static all_spawning = [];

    type: CollisionID;
    spawnTicks_int: number;
    shape;
    body;
    fixDef;
    category_bits;
    mask_bits;
    damage: number;
    velocity: number;
    width: number;
    height: number;
    alreadyInCollision = false;
    tick: (event) => void; // this will point to spawningTick() or normalTick()

    constructor(args: Args) {
        const { x, y, width, height } = args;

        this.type = CollisionID.enemy;

        // the number of ticks it takes until the enemy can start moving/firing/being killed
        this.spawnTicks_int = 20;
        this.width = width;
        this.height = height;

        // make the tick function deal with spawning the enemy
        this.tick = this.spawningTick;
        EnemyShip.all_spawning.push(this);

        // draw the shape (spawn phase animation first)
        this.shape = this.makeShape(args);
        this.setupPhysics();
        this.beforeAddToStage();

        // add to Container()
        STAGE.addChild(this.shape);

        ZIndex.update();
        GameStatistics.updateNumberOfEnemies(
            GameStatistics.getNumberOfEnemies() + 1
        );

        this.moveTo(x, y);
    }

    abstract makeShape(args: Args);
    abstract setupPhysics();

    enemyBehaviour() {}

    /*
    Gets called once after the spawn phase ended, and is going to the normal phase
 */
    afterSpawn() {}

    /*
    Its called right before the enemy is added to the Stage
 */
    beforeAddToStage() {}

    /*
    Updates the shape position to match the physic body
 */
    updateShape() {
        this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

        this.shape.x = this.body.GetWorldCenter().x * SCALE;
        this.shape.y = this.body.GetWorldCenter().y * SCALE;
    }

    getPosition() {
        return {
            x: this.shape.x,
            y: this.shape.y,
        };
    }

    getX() {
        return this.shape.x;
    }

    getY() {
        return this.shape.y;
    }

    moveTo(x, y) {
        this.shape.x = x;
        this.shape.y = y;

        var position = new b2Vec2(x / SCALE, y / SCALE);

        this.body.SetPosition(position);
    }

    rotate(degrees) {
        this.shape.rotation = degrees;

        this.body.SetAngle((degrees * Math.PI) / 180);
    }

    damageGiven() {
        return this.damage;
    }

    tookDamage() {
        // do this

        // just remove it (override this for something different)
        this.remove();
    }

    checkLimits() {
        var x = this.getX();
        var y = this.getY();

        if (x < 0) {
            this.moveTo(GAME_WIDTH, y);
        } else if (x > GAME_WIDTH) {
            this.moveTo(0, y);
        } else if (y < 0) {
            this.moveTo(x, GAME_HEIGHT);
        } else if (y > GAME_HEIGHT) {
            this.moveTo(x, 0);
        }
    }

    /*
    Remove the enemy ship, and update the game statistics
 */
    remove() {
        STAGE.removeChild(this.shape);
        WORLD.destroyBody(this.body);

        var position = EnemyShip.all.indexOf(this);

        EnemyShip.all.splice(position, 1);

        GameStatistics.updateNumberOfEnemies(
            GameStatistics.getNumberOfEnemies() - 1
        );

        GameStatistics.updateScore(GameStatistics.getScore() + 1);
    }

    /*
    Remove everything
 */
    static removeAll() {
        $(EnemyShip.all).each(function (index, ship) {
            ship.remove(index);
        });

        $(EnemyShip.all_spawning).each(function (index, ship) {
            STAGE.removeChild(ship.shape);
            WORLD.destroyBody(ship.body);

            var position = EnemyShip.all_spawning.indexOf(ship);

            EnemyShip.all_spawning.splice(position, 1);
        });
    }

    /*
    The idea here is to have a time when the enemy ship can't do damage (or receive), since its still spawning.
    This prevents problems like a ship spawning right under the main ship (and so taking damage without any chance to prevent it)
 */
    spawningTick(event) {
        if (event.paused) {
            return;
        }

        this.spawnTicks_int--;

        if (this.spawnTicks_int < 0) {
            // play the main animation
            this.shape.gotoAndPlay("main");

            // only add now to the enemies list (so, only from now on will the bullets be able to kill it, etc)
            EnemyShip.all.push(this);

            // remove from the spawn array
            var spawnIndex = EnemyShip.all_spawning.indexOf(this);
            EnemyShip.all_spawning.splice(spawnIndex, 1);

            var fixDef = this.fixDef;

            fixDef.filter.categoryBits = CATEGORY.enemy;
            fixDef.filter.maskBits = MASK.enemy;

            this.category_bits = CATEGORY.enemy;
            this.mask_bits = MASK.enemy;

            this.body.CreateFixture(fixDef);

            this.afterSpawn();

            // now execute the normal tick function
            this.tick = this.normalTick;
        }
    }

    normalTick(event) {
        if (event.paused) {
            return;
        }

        this.enemyBehaviour();

        this.updateShape();

        // the limits of the canvas
        this.checkLimits();
    }
}
