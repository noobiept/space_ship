import EnemyShip, { EnemyShipArgs } from "./enemy_ship";
import { PRELOAD, SCALE, WORLD, MAIN_SHIP } from "../main";
import { calculateAngleBetweenObjects } from "../shared/utilities";
import Bullet1_laser from "../bullets/bullet1_laser";
import { CATEGORY, MASK } from "../game/collision_detection";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2CircleShape,
    b2Vec2,
} from "../shared/constants";

export type FullEnemyRotateAroundArgs = {} & EnemyShipArgs;

export type EnemyRotateAroundArgs = Omit<
    FullEnemyRotateAroundArgs,
    "width" | "height"
>;

export default class EnemyRotateAround extends EnemyShip<
    FullEnemyRotateAroundArgs
> {
    ticksUntilNextBullet: number;
    countTicks: number;

    constructor(args: EnemyRotateAroundArgs) {
        super({
            ...args,
            width: 20,
            height: 20,
            damage: args.damage ?? 10,
            velocity: args.velocity ?? 1,
        });

        this.ticksUntilNextBullet = 100;
        this.countTicks = 0;
    }

    makeShape({ width, height }: FullEnemyRotateAroundArgs) {
        const speed = 0.2;
        const spriteSheet = {
            animations: {
                spawn: {
                    frames: [0, 1, 2],
                    next: "spawn",
                    speed: speed,
                },

                main: {
                    frames: [3, 4],
                    next: "main", // set up looping
                    speed: speed,
                },
            },

            frames: {
                width,
                height,
            },

            images: [PRELOAD.getResult("enemy_rotate_around")],
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

        var bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_dynamicBody;

        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        fixDef.shape = new b2CircleShape(width / 2 / SCALE);

        const body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetUserData(this);

        return {
            body,
            fixDef,
        };
    }

    enemyBehaviour() {
        var currentX = this.shape.x;
        var currentY = this.shape.y;

        // make a triangle from the position the ship is in, relative to the enemy position
        var triangleOppositeSide = MAIN_SHIP.shape.y - currentY;
        var triangleAdjacentSide = currentX - MAIN_SHIP.shape.x;

        // find the angle, given the two sides (of a right triangle)
        var angleRadians = Math.atan2(
            triangleOppositeSide,
            triangleAdjacentSide
        );

        var x = Math.sin(angleRadians) * this.velocity;
        var y = Math.cos(angleRadians) * this.velocity;

        this.body.SetLinearVelocity(new b2Vec2(x, y));
    }

    /*
    Gets called in the base class .tick() function

    Shoots the bullets
 */
    normalTick(event: createjs.TickerEvent) {
        super.normalTick(event);

        this.countTicks++;

        // fire a new bullet
        if (this.countTicks >= this.ticksUntilNextBullet) {
            this.countTicks = 0;

            var angleRotation = calculateAngleBetweenObjects(this, MAIN_SHIP);

            // we multiply by -1 because the .rotation property seems to have the angles in the other direction
            angleRotation *= -1;

            new Bullet1_laser({
                ship: this,
                color: "red",
                angleRotation,
                damage: this.damage,
            });
        }
    }
}
