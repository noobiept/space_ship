import { toRadians } from "@drk4/utilities";
import { STAGE, MAIN_SHIP, WORLD } from "../main";
import * as ZIndex from "../game/z_index";
import { outOfBounds } from "../shared/utilities";
import { CollisionID, Category, Mask } from "../game/collision_detection";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2PolygonShape,
    b2Vec2,
    SCALE,
} from "../shared/constants";
import { GameElement } from "../shared/types";

export type BulletArgs = {
    x: number;
    y: number;
    angleRotation: number;
    color: string;
    category: Category;
    mask: Mask;
};

export type AdditionalBulletArgs = {
    width: number;
    height: number;
    damage: number;
    speed: number;
};

export default abstract class Bullet<Args extends BulletArgs>
    implements GameElement {
    type = CollisionID.bullet;
    body: Box2D.Dynamics.b2Body;
    fixDef: Box2D.Dynamics.b2FixtureDef;
    alreadyInCollision = false;

    protected shape: createjs.Shape;
    protected width: number;
    protected color: string;
    protected speed: number;
    protected angleRotation: number;

    private damage: number;
    private removed: boolean;
    private height: number;

    // all the bullets (from the enemies or the main ship)
    static all_bullets: Bullet<BulletArgs>[] = [];

    constructor(args: Args & AdditionalBulletArgs) {
        const {
            angleRotation,
            x,
            y,
            width,
            height,
            color,
            damage,
            speed,
        } = args;

        this.damage = damage;
        this.speed = speed;
        this.removed = false;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angleRotation = angleRotation;

        // draw the bullet
        this.shape = this.drawBullet(args);

        const { body, fixDef } = this.setupPhysics(args);

        this.body = body;
        this.fixDef = fixDef;

        STAGE.addChild(this.shape);
        ZIndex.update();

        Bullet.all_bullets.push(this);

        // fire from outside the main ship radius (so it doesn't collide immediately with it)
        const shipRadius = MAIN_SHIP.width / 2;
        const radians = toRadians(angleRotation);

        const addX = Math.cos(radians) * shipRadius;
        const addY = Math.sin(radians) * shipRadius;

        this.rotate(angleRotation);
        this.moveTo(x + addX, y + addY);
    }

    abstract drawBullet(args: Args & AdditionalBulletArgs): createjs.Shape;

    setupPhysics(args: Args & AdditionalBulletArgs) {
        const { category, mask, width, height } = args;

        // physics
        const fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = category;
        fixDef.filter.maskBits = mask;

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

        const body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetBullet(true);
        body.SetUserData(this);

        return { body, fixDef };
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

    updateShape() {
        this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

        this.shape.x = this.body.GetWorldCenter().x * SCALE;
        this.shape.y = this.body.GetWorldCenter().y * SCALE;
    }

    /*
     * How much damage the bullets gives to the ship when it hits.
     */
    damageGiven() {
        return this.damage;
    }

    /*
     * What to do to the bullet when a collision is detected.
     */
    collisionResponse() {
        // default is to remove the bullet, but you can override this function to do something else
        this.remove();
    }

    rotate(degrees: number) {
        this.shape.rotation = degrees;
        this.body.SetAngle((degrees * Math.PI) / 180);
    }

    /*
     * Mark the bullet as removed from the stage.
     */
    remove() {
        this.removed = true;
    }

    removeNow() {
        const all = Bullet.all_bullets;

        STAGE.removeChild(this.shape);
        WORLD.destroyBody(this.body);

        const position = all.indexOf(this);
        all.splice(position, 1);
    }

    tick(event: createjs.TickerEvent) {
        if (event.paused || this.removed) {
            return;
        }

        this.updateShape();
    }

    /*
     * Remove all bullets.
     */
    static removeAllBullets() {
        for (let a = Bullet.all_bullets.length - 1; a >= 0; a--) {
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
