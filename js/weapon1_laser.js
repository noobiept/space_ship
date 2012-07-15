/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";

function Weapon1_laser( shipObject )
{
    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 8;
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon1_laser, Bullets );


Weapon1_laser.prototype.drawBullet = function()
{
var shipObject = this.shipObject;

var bullet = new Shape();

bullet.x = shipObject.x;
bullet.y = shipObject.y;
bullet.rotation = shipObject.rotation;


var g = bullet.graphics;

g.beginStroke("rgb(255, 255, 255)");

g.moveTo(-1, 0);
g.lineTo(1, 0);
g.closePath();

this.shape = bullet;
};