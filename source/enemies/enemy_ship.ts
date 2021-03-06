import { STAGE, WORLD } from "../main";
import * as Canvas from "../game/canvas";
import * as ZIndex from "../game/z_index";
import * as GameStatistics from "../menus/game_statistics";
import { CollisionID, Category, Mask } from "../game/collision_detection";
import { b2Vec2, SCALE } from "../shared/constants";
import { GameElement, PhysicsObjects } from "../shared/types";

export type EnemyShipArgs = {
    x: number;
    y: number;
    damage: number;
    velocity: number;
    width: number;
    height: number;
};

export default abstract class EnemyShip<Args extends EnemyShipArgs>
    implements GameElement {
    static all: EnemyShip<EnemyShipArgs>[] = [];
    static all_spawning: EnemyShip<EnemyShipArgs>[] = [];

    alreadyInCollision = false;
    type = CollisionID.enemy;
    body: Box2D.Dynamics.b2Body;
    fixDef: Box2D.Dynamics.b2FixtureDef;
    tick: (event: createjs.TickerEvent) => void; // this will point to spawningTick() or normalTick()

    protected width: number;
    protected height: number;
    protected category_bits!: Category;
    protected mask_bits!: Mask;
    protected shape: createjs.Sprite;
    protected damage: number;
    protected velocity: number;

    private spawnTicks: number;

    constructor(args: Args) {
        const { x, y, width, height, damage, velocity } = args;

        // the number of ticks it takes until the enemy can start moving/firing/being killed
        this.spawnTicks = 20;
        this.width = width;
        this.height = height;
        this.damage = damage;
        this.velocity = velocity;

        // make the tick function deal with spawning the enemy
        this.tick = this.spawningTick;
        EnemyShip.all_spawning.push(this);

        // draw the shape (spawn phase animation first)
        this.shape = this.makeShape(args);
        const { body, fixDef } = this.setupPhysics();

        this.body = body;
        this.fixDef = fixDef;

        this.beforeAddToStage();

        // add to Container()
        STAGE.addChild(this.shape);

        ZIndex.update();
        GameStatistics.updateNumberOfEnemies(
            GameStatistics.getNumberOfEnemies() + 1
        );

        this.moveTo(x, y);
    }

    abstract makeShape(args: Args): createjs.Sprite;
    abstract setupPhysics(): PhysicsObjects;

    enemyBehaviour() {}

    /*
     * Gets called once after the spawn phase ended, and is going to the normal phase.
     */
    afterSpawn() {}

    /*
     * Its called right before the enemy is added to the Stage.
     */
    beforeAddToStage() {}

    /*
     * Updates the shape position to match the physic body.
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

    moveTo(x: number, y: number) {
        this.shape.x = x;
        this.shape.y = y;

        const position = new b2Vec2(x / SCALE, y / SCALE);

        this.body.SetPosition(position);
    }

    rotate(degrees: number) {
        this.shape.rotation = degrees;
        this.body.SetAngle((degrees * Math.PI) / 180);
    }

    getRotation() {
        return this.shape.rotation;
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
        const x = this.getX();
        const y = this.getY();
        const { width, height } = Canvas.getDimensions();

        if (x < 0) {
            this.moveTo(width, y);
        } else if (x > width) {
            this.moveTo(0, y);
        } else if (y < 0) {
            this.moveTo(x, height);
        } else if (y > height) {
            this.moveTo(x, 0);
        }
    }

    /*
     * Remove the enemy ship, and update the game statistics.
     */
    remove(removeFromAll = true) {
        STAGE.removeChild(this.shape);
        WORLD.destroyBody(this.body);

        if (removeFromAll) {
            const position = EnemyShip.all.indexOf(this);
            EnemyShip.all.splice(position, 1);
        }

        GameStatistics.updateNumberOfEnemies(
            GameStatistics.getNumberOfEnemies() - 1
        );

        GameStatistics.updateScore(GameStatistics.getScore() + 1);
    }

    /*
     * Remove everything.
     */
    static removeAll() {
        EnemyShip.all.forEach((ship) => {
            ship.remove(false);
        });
        EnemyShip.all.length = 0;

        EnemyShip.all_spawning.forEach((ship) => {
            STAGE.removeChild(ship.shape);
            WORLD.destroyBody(ship.body);
        });
        EnemyShip.all_spawning.length = 0;
    }

    /*
     * The idea here is to have a time when the enemy ship can't do damage (or receive), since its still spawning.
     * This prevents problems like a ship spawning right under the main ship (and so taking damage without any chance to prevent it).
     */
    spawningTick(event: createjs.TickerEvent) {
        if (event.paused) {
            return;
        }

        this.spawnTicks--;

        if (this.spawnTicks < 0) {
            // play the main animation
            this.shape.gotoAndPlay("main");

            // only add now to the enemies list (so, only from now on will the bullets be able to kill it, etc)
            EnemyShip.all.push(this);

            // remove from the spawn array
            const spawnIndex = EnemyShip.all_spawning.indexOf(this);
            EnemyShip.all_spawning.splice(spawnIndex, 1);

            const fixDef = this.fixDef;

            fixDef.filter.categoryBits = Category.enemy;
            fixDef.filter.maskBits = Mask.enemy;

            this.category_bits = Category.enemy;
            this.mask_bits = Mask.enemy;
            this.body.CreateFixture(fixDef);
            this.afterSpawn();

            // now execute the normal tick function
            this.tick = this.normalTick;
        }
    }

    normalTick(event: createjs.TickerEvent) {
        if (event.paused) {
            return;
        }

        this.enemyBehaviour();
        this.updateShape();

        // the limits of the canvas
        this.checkLimits();
    }
}
