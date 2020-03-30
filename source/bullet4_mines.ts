import Bullet, { BulletArgs } from "./bullet";
import SplashDamage from "./splash_damage";

    // remove the mines after some time
const REMOVE_TICK = 250;

    // rotate the mine
const ANGLE_TICK = 15;


export type Bullet4_minesArgs = {
    color: string
} & BulletArgs

export default class Bullet4_mines extends Bullet {

    speed;
    angle;
    angleTick;
    color;
    countTick;

constructor(args: Bullet4_minesArgs)
{
    super(args);

this.width = 15;
this.height = 15;
this.color = args.color;

this.speed = 0;
this.damage = 50;

    // count the ticks, and when it reaches 0 remove the mine
this.countTick = REMOVE_TICK;

    // angle of the mine points (for the animation, keep rotating the mine)
this.angle = 0;

this.angleTick = ANGLE_TICK;
}


drawBullet( angleRotation )
{
var width = this.width;
var height = this.height;

var mine = new createjs.Shape();

mine.regX = width / 2;
mine.regY = height / 2;
mine.rotation = angleRotation;

var g = mine.graphics;

var halfPoint = width / 2;  // width is same as height

g.beginFill( this.color );
g.drawPolyStar( halfPoint, halfPoint, halfPoint, 5, 0.5, this.angle );
g.drawCircle( halfPoint, halfPoint, 4 / 6 * halfPoint );


this.shape = mine;
};


/*
    Have an animation of the mine (rotates around itself)
 */

rotateMine()
{
this.angle += 45;

if (this.angle > 360)
    {
    this.angle = 0;
    }

var mine = this.shape;

var g = mine.graphics;

var halfPoint = this.width / 2;  // width is same as height

g.clear();
g.beginFill( this.color );
g.drawPolyStar( halfPoint, halfPoint, halfPoint, 5, 0.5, this.angle );
g.drawCircle( halfPoint, halfPoint, 4 / 6 * halfPoint );

this.angleTick = ANGLE_TICK;
};


/*
    What to do to the bullet when a collision is detected
 */

collisionResponse()
{
this.remove();

new SplashDamage({ ship: this.shipObject, x: this.getX(), y: this.getY(), maxRadius: 40, color: this.color, splashDuration: 40  } );
};



tick(event) {
    super.tick(event)

    this.countTick--;
this.angleTick--;

    // remove the mine after some time (so that it doesn't stay there forever
if ( this.countTick < 0 )
    {
    this.remove();
    }

else if ( this.angleTick < 0 )
    {
    this.rotateMine();
    }
};
}
