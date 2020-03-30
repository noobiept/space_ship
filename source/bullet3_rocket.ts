import Bullet, { BulletArgs } from "./bullet";
import { applyImpulse } from "./utilities";
import SplashDamage from "./splash_damage";

export type Bullet3_rocketArgs = {
    color: string
} & BulletArgs


export default class Bullet3_rocket extends Bullet {

speed: number;
color;

constructor( args: Bullet3_rocketArgs )
{
    super(args)

    let { color, angleRotation, ship} = args

this.width = 15;
this.height = 7;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = ship.getRotation();
    }


this.damage = 20;
this.speed = 9;

applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}



drawBullet( angleRotation )
{
var width = this.width;
var height = this.height;

var rocket = new createjs.Shape();

rocket.regX = width / 2;
rocket.regY = height / 2;
rocket.rotation = angleRotation;

var g = rocket.graphics;

g.beginFill( this.color );
g.drawRect( 0, 0, width / 2, height );
g.moveTo( width / 2, 0 );
g.bezierCurveTo( width, 0, width, height, width / 2, height );


this.shape = rocket;
};


/*
    What to do to the bullet when a collision is detected
 */

collisionResponse()
{
this.remove();

new SplashDamage({ ship: this.shipObject, x: this.getX(), y: this.getY(), maxRadius: 17, color: this.color, splashDuration: 30  } );
};
}