import EnemyShip, { EnemyShipArgs } from "./enemy_ship";
import { WORLD } from "../main";
import { Category, Mask } from "../game/collision_detection";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2PolygonShape,
    b2Vec2,
    SCALE,
} from "../shared/constants";
import { getAsset } from "../shared/assets";

export type FullEnemyMoveHorizontallyArgs = {} & EnemyShipArgs;

export type EnemyMoveHorizontallyArgs = Omit<
    FullEnemyMoveHorizontallyArgs,
    "width" | "height"
>;

export default class EnemyMoveHorizontally extends EnemyShip<
    FullEnemyMoveHorizontallyArgs
> {
    constructor(args: EnemyMoveHorizontallyArgs) {
        super({
            ...args,
            width: 20,
            height: 20,
            damage: args.damage ?? 10,
            velocity: args.velocity ?? 1,
        });
    }

    makeShape({ width, height }: FullEnemyMoveHorizontallyArgs) {
        var speed = 0.2;

        var spriteSheet = {
            animations: {
                spawn: {
                    frames: [0, 1, 2],
                    next: "spawn",
                    speed: speed,
                },

                main: {
                    frames: [3, 4],
                    next: "main",
                    speed: speed,
                },
            },

            frames: {
                width,
                height,
            },

            images: [getAsset("enemy_move_horizontally")],
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
        var height = this.height;

        // physics
        var fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = Category.enemy_spawning;
        fixDef.filter.maskBits = Mask.enemy_spawning;

        this.category_bits = Category.enemy_spawning;
        this.mask_bits = Mask.enemy_spawning;

        var bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_dynamicBody;

        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        const shape = new b2PolygonShape();

        // arguments: half width, half height
        shape.SetAsBox(width / 2 / SCALE, height / 2 / SCALE);
        fixDef.shape = shape;

        const body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetUserData(this);

        return { body, fixDef };
    }

    afterSpawn() {
        this.body.SetLinearVelocity(new b2Vec2(this.velocity, 0));
    }
}
