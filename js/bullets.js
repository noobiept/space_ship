/*global Shape, Bullets, STAGE, CANVAS*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{

function Bullets( shipObject )
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

STAGE.addChild( bullet );


Bullets.all.push( bullet );
}


Bullets.all = [];

Bullets.speed = 8;



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
    
        // remove the bullets that are out of the canvas
    if ( Bullets.reachedLimits( bulletObject ) )
        {
        Bullets.remove( i );
        
            // since we removed one element, the index shifted one position
        i--;
        }
    }
};




Bullets.reachedLimits = function( bulletObject )
{
var x = bulletObject.x;
var y = bulletObject.y;

if (x < 0 || x > CANVAS.width || y < 0 || y > CANVAS.height)
    {
    return true;
    }

return false;
};



Bullets.remove = function( position )
{
STAGE.removeChild( Bullets.all[ position ] );

Bullets.all.splice( position, 1 );
};



Bullets.tick = function()
{
Bullets.moveForwardBullets();
};


    // public stuff
window.Bullets = Bullets;

}(window));