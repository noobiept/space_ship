import Bullet, { BulletArgs } from "./bullet.js";
import { applyImpulse } from "./utilities.js";
import SplashDamage from "./splash_damage.js";

export type Bullet3_rocketArgs = {
    color: string;
} & BulletArgs;

export default class Bullet3_rocket extends Bullet<Bullet3_rocketArgs> {
    speed: number;
    color;

    constructor(args: Bullet3_rocketArgs) {
        super({
            ...args,
            width: 15,
            height: 7,
            damage: 20,
            speed: 9,
        });

        applyImpulse(
            this.body,
            this.angleRotation,
            this.speed * this.body.GetMass()
        );
    }

    drawBullet(args) {
        const { width, height, angleRotation, color } = args;

        const rocket = new createjs.Shape();

        rocket.regX = width / 2;
        rocket.regY = height / 2;
        rocket.rotation = angleRotation;

        const g = rocket.graphics;

        g.beginFill(color);
        g.drawRect(0, 0, width / 2, height);
        g.moveTo(width / 2, 0);
        g.bezierCurveTo(width, 0, width, height, width / 2, height);

        return rocket;
    }

    /*
    What to do to the bullet when a collision is detected
 */

    collisionResponse() {
        this.remove();

        new SplashDamage({
            ship: this.shipObject,
            x: this.getX(),
            y: this.getY(),
            maxRadius: 17,
            color: this.color,
            splashDuration: 30,
        });
    }
}
