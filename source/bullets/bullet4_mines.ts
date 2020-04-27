import Bullet, { BulletArgs, AdditionalBulletArgs } from "./bullet";
import SplashDamage from "./splash_damage";

// remove the mines after some time
const REMOVE_TICK = 250;

// rotate the mine
const ANGLE_TICK = 15;

export type Bullet4_minesArgs = {} & BulletArgs;

export default class Bullet4_mines extends Bullet<Bullet4_minesArgs> {
    private angle: number;
    private angleTick: number;
    private countTick: number;

    constructor(args: Bullet4_minesArgs) {
        super({
            ...args,
            width: 15,
            height: 15,
            damage: 50,
            speed: 0,
        });

        // count the ticks, and when it reaches 0 remove the mine
        this.countTick = REMOVE_TICK;

        // angle of the mine points (for the animation, keep rotating the mine)
        this.angle = 0;
        this.angleTick = ANGLE_TICK;
    }

    drawBullet(args: Bullet4_minesArgs & AdditionalBulletArgs) {
        const { width, height, angleRotation, color } = args;

        const mine = new createjs.Shape();

        mine.regX = width / 2;
        mine.regY = height / 2;
        mine.rotation = angleRotation;

        const g = mine.graphics;
        const halfPoint = width / 2; // width is same as height

        g.beginFill(color);
        g.drawPolyStar(halfPoint, halfPoint, halfPoint, 5, 0.5, 0);
        g.drawCircle(halfPoint, halfPoint, (4 / 6) * halfPoint);

        return mine;
    }

    /*
    Have an animation of the mine (rotates around itself)
 */

    rotateMine() {
        this.angle += 45;

        if (this.angle > 360) {
            this.angle = 0;
        }

        var mine = this.shape;

        var g = mine.graphics;

        var halfPoint = this.width / 2; // width is same as height

        g.clear();
        g.beginFill(this.color);
        g.drawPolyStar(halfPoint, halfPoint, halfPoint, 5, 0.5, this.angle);
        g.drawCircle(halfPoint, halfPoint, (4 / 6) * halfPoint);

        this.angleTick = ANGLE_TICK;
    }

    /*
    What to do to the bullet when a collision is detected
 */

    collisionResponse() {
        this.remove();

        new SplashDamage({
            x: this.getX(),
            y: this.getY(),
            angleRotation: 0,
            color: this.color,
            category: this.fixDef.filter.categoryBits,
            mask: this.fixDef.filter.maskBits,
            splashDuration: 40,
            maxRadius: 40,
        });
    }

    tick(event: createjs.TickerEvent) {
        super.tick(event);

        this.countTick--;
        this.angleTick--;

        // remove the mine after some time (so that it doesn't stay there forever
        if (this.countTick < 0) {
            this.remove();
        } else if (this.angleTick < 0) {
            this.rotateMine();
        }
    }
}
