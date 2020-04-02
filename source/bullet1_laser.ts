import Bullet, { BulletArgs } from "./bullet.js";
import { applyImpulse } from "./utilities.js";

export type Bullet1_laserArgs = {
    damage?: number;
    color: string;
} & BulletArgs;

export default class Bullet1_laser extends Bullet<Bullet1_laserArgs> {
    constructor(args) {
        super({
            ...args,
            width: 4,
            height: 2,
            damage: args.damage ?? 10,
            speed: 14,
        });

        applyImpulse(
            this.body,
            this.angleRotation,
            this.speed * this.body.GetMass()
        );
    }

    drawBullet(args) {
        const { width, height, angleRotation, color } = args;

        const laser = new createjs.Shape();

        laser.regX = width / 2;
        laser.regY = height / 2;
        laser.rotation = angleRotation;

        const g = laser.graphics;

        g.beginFill(color);
        g.drawRect(0, 0, width, height);

        return laser;
    }
}
