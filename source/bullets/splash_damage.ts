import Bullet, { BulletArgs } from "./bullet.js";
import { SCALE, WORLD } from "../main.js";
import { CollisionID } from "../game/collision_detection.js";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2CircleShape,
} from "../shared/constants.js";

export type SplashDamageArgs = {
    maxRadius: number;
    color: string;
    splashDuration: number;
} & BulletArgs;

/*
    The splash damage starts with radius of 1, then expands until it reaches the maximum value, then back again until 1, before being removed
 */
export default class SplashDamage extends Bullet<SplashDamageArgs> {
    splashDuration;
    radiusPerTick: number;
    radius: number;
    color;
    bodyDef;
    countTick: number;
    x: number;
    y: number;

    constructor(args: SplashDamageArgs) {
        const radius = 1;

        super({
            ...args,
            width: radius * 2,
            height: radius * 2,
            damage: 5,
            speed: 0,
        });

        const { splashDuration, maxRadius, x, y } = args;

        // duration (in number of ticks) of the splash damage (for that time, any ship that goes into that area takes damage. after that, the splash is removed)
        this.splashDuration = splashDuration;

        // how much radius is increase per tick
        // it can be a float value, but the change will only occur at integer changes
        // its 2 times, because it has to grow and shrink
        this.radiusPerTick = (2 * maxRadius) / splashDuration;

        // start with radius of 1, and grow from there
        this.radius = radius;
        this.type = CollisionID.bullet;
        this.countTick = 0;

        this.x = x;
        this.y = y;

        this.moveTo(x, y);
    }

    drawBullet(args) {
        const { radius, color } = args;
        const shape = new createjs.Shape();
        const g = shape.graphics;

        g.beginFill(color);
        g.drawCircle(0, 0, radius);

        return shape;
    }

    setupPhysics() {
        var fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = this.shipObject.category_bits;
        fixDef.filter.maskBits = this.shipObject.mask_bits;

        fixDef.isSensor = true;

        var bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_dynamicBody;

        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        fixDef.shape = new b2CircleShape(this.radius / SCALE);

        var body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetUserData(this);

        this.body = body;
        this.bodyDef = bodyDef;
        this.fixDef = fixDef;
    }

    setRadius(radius) {
        // box2dweb doesn't seem to be able to resize existing bodies, so we create again the body (kind of stupid but oh well.. >.>)
        WORLD.destroyBody(this.body);

        this.body = WORLD.createBody(this.bodyDef);
        this.body.SetUserData(this);

        this.fixDef.shape = new b2CircleShape(radius / SCALE);

        this.body.CreateFixture(this.fixDef);

        var g = this.shape.graphics;

        g.clear();
        g.beginFill(this.color);
        g.drawCircle(0, 0, radius);

        this.radius = radius;

        this.moveTo(this.x, this.y);
    }

    collisionResponse() {
        // the element will be removed in other place, keep it for now
    }

    tick(event) {
        super.tick(event);

        this.countTick++;

        var isGrowing = true;

        if (this.countTick > this.splashDuration * 0.5) {
            isGrowing = false;
        }

        if (isGrowing) {
            this.radius += this.radiusPerTick;
        } else {
            this.radius -= this.radiusPerTick;

            if (this.radius < 1) {
                this.radius = 1;
            }
        }

        this.setRadius(Math.round(this.radius));

        if (this.countTick >= this.splashDuration) {
            this.remove();
        }
    }
}
