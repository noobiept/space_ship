import { getRandomFloat } from "@drk4/utilities";
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

export type FullEnemyRocksArgs = {
    scale?: number; // scale the original image (1 -> 100%, no scaling)
} & EnemyShipArgs;

// we define the width/height directly on the constructor, so no need to pass them
export type EnemyRocksArgs = Omit<FullEnemyRocksArgs, "width" | "height">;

export default class EnemyRocks extends EnemyShip<FullEnemyRocksArgs> {
    private angleRadians!: number;

    constructor(args: EnemyRocksArgs) {
        super({
            ...args,
            width: 50,
            height: 50,
            damage: args.damage ?? 5,
            velocity: args.velocity ?? 1,
        });
    }

    makeShape({ width, height, scale = 1 }: FullEnemyRocksArgs) {
        const speed = 0.2;
        const spriteConfig = {
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
            images: [getAsset("enemy_rocks")],
        };

        const sprite = new createjs.SpriteSheet(spriteConfig);
        const rock = new createjs.Sprite(sprite);

        // origin in the middle of the image
        rock.regX = width / 2;
        rock.regY = height / 2;

        rock.scaleX = scale;
        rock.scaleY = scale;

        // don't update these variables before the scaling (they're are used in the config above, and the scaling is applied later)
        this.width *= scale;
        this.height *= scale;

        // it moves
        this.angleRadians = getRandomFloat(0, 2 * Math.PI);

        rock.gotoAndPlay("spawn");

        return rock;
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

        const bodyDef = new b2BodyDef();

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

    enemyBehaviour() {
        var x = Math.sin(this.angleRadians) * this.velocity;
        var y = Math.cos(this.angleRadians) * this.velocity;

        this.body.SetLinearVelocity(new b2Vec2(x, y));

        this.rotate(this.shape.rotation + 1);
    }

    /*
     * When it takes damage, create new smaller rocks.
     */
    tookDamage() {
        if (this.width >= 50) {
            for (let i = 0; i < 3; i++) {
                // spawn from the current position
                new EnemyRocks({
                    x: this.shape.x,
                    y: this.shape.y,
                    scale: 0.5,
                    damage: this.damage,
                    velocity: this.velocity,
                });
            }
        }

        this.remove();
    }
}
