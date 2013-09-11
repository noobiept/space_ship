"use strict";

function Bullet3_rocket( shipObject, color, angleRotation )
{
this.width = 15;
this.height = 7;
this.color = color;

if ( typeof angleRotation == 'undefined' )
    {
    angleRotation = shipObject.getRotation();
    }

    // inherit from the Bullet class
Bullet.call( this, shipObject, angleRotation );

this.damage = 20;
this.speed = 7;

applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}


    // inherit the member functions
INHERIT_PROTOTYPE( Bullet3_rocket, Bullet );


Bullet3_rocket.prototype.drawBullet = function( angleRotation )
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

Bullet3_rocket.prototype.collisionResponse = function()
{
this.remove();

new SplashDamage( this.shipObject, this.getX(), this.getY(), 10, this.color, 40 );
};