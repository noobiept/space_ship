/*global Bullet, applyImpulse, INHERIT_PROTOTYPE, createjs*/
"use strict";

function Bullet2_sniper( shipObject, color, angleRotation )
{
this.width = 10;
this.height = 2;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = shipObject.getRotation();
    }

    // inherit from the Bullet class
Bullet.call( this, shipObject, angleRotation );

this.damage = 40;
this.speed = 40;

applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}


    // inherit the member functions
INHERIT_PROTOTYPE( Bullet2_sniper, Bullet );


Bullet2_sniper.prototype.drawBullet = function( angleRotation )
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




Bullet2_sniper.prototype.collisionResponse = function()
{
    // the default is to remove the bullet, but for the sniper we want the bullet to continue going forward, and possibly taking down more enemies (until it goes out of the canvas)
    // therefore, no code here, just keep the bullet
};
