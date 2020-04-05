import { toRadians } from "@drk4/utilities";
import EnemyShip, { EnemyShipArgs } from "./enemy_ship";
import { PRELOAD, SCALE, WORLD, MAIN_SHIP } from "../main";
import { calculateAngleBetweenObjects } from "../shared/utilities";
import { CATEGORY, MASK } from "../game/collision_detection";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2CircleShape,
    b2Vec2,
} from "../shared/constants";

export type FullEnemyKamikazeArgs = {} & EnemyShipArgs;

export type EnemyKamikazeArgs = Omit<FullEnemyKamikazeArgs, "width" | "height">;

export default class EnemyKamikaze extends EnemyShip<FullEnemyKamikazeArgs> {
    constructor(args: EnemyKamikazeArgs) {
        super({
            ...args,
            width: 14,
            height: 14,
            damage: args.damage ?? 10,
            velocity: args.velocity ?? 2,
        });
    }

    makeShape({ width, height }: FullEnemyKamikazeArgs) {
        const speed = 0.2;
        const spriteSheet = {
            animations: {
                spawn: {
                    frames: [0, 1, 2],
                    next: "spawn",
                    speed: speed,
                },
                main: {
                    frames: [3],
                    next: "main",
                    speed: speed,
                },
            },
            frames: {
                width,
                height,
            },
            images: [PRELOAD.getResult("enemy_kamikaze")],
        };

        const ss = new createjs.SpriteSheet(spriteSheet);
        const enemy = new createjs.Sprite(ss);

        // origin in the middle of the image
        enemy.regX = width / 2;
        enemy.regY = height / 2;

        enemy.gotoAndPlay("spawn");

        return enemy;
    }

    setupPhysics() {
        var width = this.width;

        // physics
        var fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = CATEGORY.enemy_spawning;
        fixDef.filter.maskBits = MASK.enemy_spawning;

        this.category_bits = CATEGORY.enemy_spawning;
        this.mask_bits = MASK.enemy_spawning;

        const bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        fixDef.shape = new b2CircleShape(width / 2 / SCALE);

        const body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetUserData(this);

        return { body, fixDef };
    }

    enemyBehaviour() {
        var angle = calculateAngleBetweenObjects(this, MAIN_SHIP);

        // we multiply by -1 because the .rotation property seems to have the angles in the other direction (not quite sure..)
        angle *= -1;

        var radians = toRadians(angle);

        var velocity = this.velocity;

        var x = Math.cos(radians) * velocity;
        var y = Math.sin(radians) * velocity;

        this.body.SetLinearVelocity(new b2Vec2(x, y));

        this.updateRotation();
    }

    beforeAddToStage() {
        this.updateRotation();
    }

    /*
    Updates the rotation property so that the enemy ship points at the main ship
 */
    updateRotation() {
        // calculate the angle between the enemy and the ship
        var angleDegrees = calculateAngleBetweenObjects(this, MAIN_SHIP);

        // we multiply by -1 because the .rotation property seems to have the angles in the other direction
        this.rotate(-1 * angleDegrees);
    }

    spawningTick(event: createjs.TickerEvent) {
        super.spawningTick(event);
        this.updateRotation();
    }
}
