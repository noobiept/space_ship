/*global Shape, Bullets*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{

function Bullets( shipObject, stageObject )
{
var bullet = new Shape();

bullet.x = shipObject.x;
bullet.y = shipObject.y;
bullet.rotation = shipObject.rotation;

    // draw the bullet
    
var g = bullet.graphics;

g.beginStroke("rgb(255, 255, 255)");

g.moveTo(-1, 0);
g.lineTo(1, 0);
g.closePath();

stageObject.addChild( bullet );


Bullets.stageObject = stageObject;

Bullets.all.push( bullet );
}


Bullets.all = [];

Bullets.speed = 5;



Bullets.moveForwardBullets = function()
{
var all = Bullets.all;

var bulletObject;
var rotation;

var i;

for (i = 0 ; i < all.length ; i++)
    {
    bulletObject = all[i];
    
    
        //HERE
    rotation = bulletObject.rotation - 90;
    
    bulletObject.x += Math.sin( rotation * (Math.PI/-180) ) * Bullets.speed;
    bulletObject.y += Math.cos( rotation * (Math.PI/-180) ) * Bullets.speed;
    }
};



Bullets.remove = function( position )
{
Bullets.stageObject.removeChild( Bullets.all[ position ] );

Bullets.all.splice( position, 1 );
};



Bullets.tick = function()
{
Bullets.moveForwardBullets();
};


    // public stuff
window.Bullets = Bullets;

}(window));