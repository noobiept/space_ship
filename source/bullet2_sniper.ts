import Bullet, { BulletArgs } from "./bullet";
import { applyImpulse } from "./utilities";


export type Bullet2_sniperArgs = {
    color: string
} & BulletArgs

export default class Bullet2_sniper extends Bullet {

color;
speed;

constructor( args: Bullet2_sniperArgs )
{
    super( args);

    let { angleRotation, ship, color } = args
this.width = 10;
this.height = 2;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = ship.getRotation();
    }


this.damage = 40;
this.speed = 40;

applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}


drawBullet( angleRotation )
{
var width = this.width;
var height = this.height;

var sniper = new createjs.Shape();

sniper.regX = width / 2;
sniper.regY = height / 2;
sniper.rotation = angleRotation;

var g = sniper.graphics;

g.beginFill( this.color );
g.drawRect( 0, 0, width, height );


this.shape = sniper;
};




collisionResponse()
{
    // the default is to remove the bullet, but for the sniper we want the bullet to continue going forward, and possibly taking down more enemies (until it goes out of the canvas)
    // therefore, no code here, just keep the bullet
};

}