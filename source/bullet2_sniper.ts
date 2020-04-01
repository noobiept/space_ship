import Bullet, { BulletArgs } from "./bullet.js";
import { applyImpulse } from "./utilities.js";


export type Bullet2_sniperArgs = {
    color: string
} & BulletArgs

export default class Bullet2_sniper extends Bullet<Bullet2_sniperArgs> {


constructor( args: Bullet2_sniperArgs )
{
    super({
        ...args,
        width: 10,
        height:  2,
        damage: 40,
        speed: 40,
    });



applyImpulse( this.body, this.angleRotation, this.speed * this.body.GetMass() );
}


drawBullet( args )
{
    const { width, height, angleRotation, color } = args

const sniper = new createjs.Shape();

sniper.regX = width / 2;
sniper.regY = height / 2;
sniper.rotation = angleRotation;

const g = sniper.graphics;

g.beginFill( color );
g.drawRect( 0, 0, width, height );

return sniper;
};




collisionResponse()
{
    // the default is to remove the bullet, but for the sniper we want the bullet to continue going forward, and possibly taking down more enemies (until it goes out of the canvas)
    // therefore, no code here, just keep the bullet
};

}