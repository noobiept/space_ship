import Bullet from "./bullet";
import { applyImpulse } from "./utilities";

export default class Bullet1_laser extends Bullet {

color;
speed: number;

constructor( shipObject, color, angleRotation?, damage? )
{
    super(shipObject, angleRotation)

if ( typeof damage == 'undefined' )
    {
    damage = 10;
    }

this.width = 4;
this.height = 2;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = shipObject.getRotation();
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