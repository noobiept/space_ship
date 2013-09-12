"use strict";

function Bullet1_laser( shipObject, color, angleRotation, damage )
{
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


    // inherit from the Bullet class
Bullet.call( this, shipObject, angleRotation );

this.damage = damage;
this.speed = 12;


applyImpulse( this.body, angleRotation, this.speed * this.body.GetMass() );
}


    // inherit the member functions
INHERIT_PROTOTYPE( Bullet1_laser, Bullet );


Bullet1_laser.prototype.drawBullet = function( angleRotation )
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
};
