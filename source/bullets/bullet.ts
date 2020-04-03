import {
    STAGE,
    TYPE_BULLET,
    MAIN_SHIP,
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2PolygonShape,
    b2Vec2,
    SCALE,
    WORLD,
} from "../main.js";
import * as ZIndex from "../z_index.js";
import { toRadians, outOfBounds } from "../shared/utilities.js";

export type BulletArgs = {
    ship;
    color: string;
    angleRotation?: number;
    x?: number;
    y?: number;
};

export type AdditionalBulletArgs = {
    width: number;
    height: number;
    damage: number;
    speed: number;
};

/*
    Use as base class for all the bullet types

    Functions to write (in derived class):

        .drawBullet()
        .setupPhysics()         (optional -- the default is a rectangle from the width/height properties)

    Properties:

        .width
        .height
        .damage
        .speed

    Add reference of the drawn element to:

        .shape
 */
export default abstract class Bullet<Args extends BulletArgs> {
    shape;
    shipObject;
    type;
    body;
    fixDef;
    damage: number;
    removed: boolean;
    width: number;
    height: number;
    color: string;
    speed: number;
    angleRotation: number;

    // all the bullets (from the enemies or the main ship)
    static all_bullets = [];

    constructor(args: Args & AdditionalBulletArgs) {
        if (typeof args.angleRotation === "undefined") {
            args.angleRotation = args.ship.getRotation();
        }

        let {
            angleRotation,
            ship,
            x,
            y,
            width,
            height,
            color,
            damage,
            speed,
        } = args;

        this.shipObject = ship;
        this.type = TYPE_BULLET;
        this.damage = damage;
        this.speed = speed;
        this.removed = false;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angleRotation = angleRotation;

        // draw the bullet
        this.shape = this.drawBullet(args);
        this.setupPhysics(args);

        STAGE.addChild(this.shape);
        ZIndex.update();

        Bullet.all_bullets.push(this);

        if (typeof x === "undefined") {
            x = ship.getX();
            y = ship.getY();
        }

        // fire from outside the main ship radius (so it doesn't collide immediately with it)
        var shipRadius = MAIN_SHIP.width / 2;

        var radians = toRadians(angleRotation);

        var addX = Math.cos(radians) * shipRadius;
        var addY = Math.sin(radians) * shipRadius;

        this.rotate(angleRotation);
        this.moveTo(x + addX, y + addY);
    }

    abstract drawBullet(args: Args & AdditionalBulletArgs);

    setupPhysics(args: Args & AdditionalBulletArgs) {
        const { width, height, ship } = args;

        // physics
        const fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = ship.category_bits;
        fixDef.filter.maskBits = ship.mask_bits;

        // so that it doesn't have a reaction when it collides (but we still need to detect the collision)
        // useful for example for the sniper, to be able to continue moving through
        fixDef.isSensor = true;

        const bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        const shape = new b2PolygonShape();

        // arguments: half width, half height
        shape.SetAsBox(width / 2 / SCALE, height / 2 / SCALE);
        fixDef.shape = shape;

        const body = WORLD.CreateBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetBullet(true);
        body.SetUserData(this);

        this.body = body;
        this.fixDef = fixDef;
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

    updateShape() {
        this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

        this.shape.x = this.body.GetWorldCenter().x * SCALE;
        this.shape.y = this.body.GetWorldCenter().y * SCALE;
    }

    /*
    How much damage the bullets gives to the ship when it hits
 */
    damageGiven() {
        return this.damage;
    }

    /*
    What to do to the bullet when a collision is detected
 */
    collisionResponse() {
        // default is to remove the bullet, but you can override this function to do something else
        this.remove();
    }

    rotate(degrees) {
        this.shape.rotation = degrees;
        this.body.SetAngle((degrees * Math.PI) / 180);
    }

    /*
    Remove the bullet from the stage
 */
    remove() {
        this.removed = true;
    }

    removeNow() {
        var all = Bullet.all_bullets;

        STAGE.removeChild(this.shape);
        WORLD.DestroyBody(this.body);

        var position = all.indexOf(this);

        all.splice(position, 1);
    }

    tick(event) {
        if (event.paused || this.removed) {
            return;
        }

        this.updateShape();
    }

    /*
    Remove all bullets.
 */
    static removeAllBullets() {
        for (var a = Bullet.all_bullets.length - 1; a >= 0; a--) {
            Bullet.all_bullets[a].removeNow();
        }

        Bullet.all_bullets.length = 0;
    }

    /**
     * Removes all bullets that were marked to be removed, and all bullets that are out of bounds (outside of the canvas).
     */
    static cleanAll() {
        for (let i = Bullet.all_bullets.length - 1; i >= 0; i--) {
            const bulletObject = Bullet.all_bullets[i];

            if (bulletObject.removed || outOfBounds(bulletObject)) {
                bulletObject.removeNow();
            }
        }
    }
}
