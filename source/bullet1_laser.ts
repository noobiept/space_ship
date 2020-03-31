import Bullet, { BulletArgs } from "./bullet.js";
import { applyImpulse } from "./utilities.js";


export type Bullet1_laserArgs  = {
    damage?: number
    color: string
} & BulletArgs

export default class Bullet1_laser extends Bullet {

color;
speed: number;

constructor( args: Bullet1_laserArgs )
{
    super(args)

    let { ship, damage, color, angleRotation } = args

if ( typeof damage == 'undefined' )
    {
    damage = 10;
    }

this.width = 4;
this.height = 2;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = ship.getRotation();
    }



this.damage = damage;
this.speed = 14;


applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}



drawBullet( angleRotation )
{
var width = this.width;
var height = this.height;

var laser = new createjs.Shape();

laser.regX = width / 2;
laser.regY = height / 2;
laser.rotation = angleRotation;

var g = laser.graphics;

g.beginFill( this.color );
g.drawRect( 0, 0, width, height );


this.shape = laser;
}
}