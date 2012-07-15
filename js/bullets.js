/*global Shape, Bullets, STAGE, CANVAS*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{

/*
    Use as base class for the weapons
    
    Functions to write (in derived class):
    
        .drawBullet()

    Properties:
    
        .speed
        
    Add reference of the drawn element to:
    
        .shape
        
 */

function Bullets( shipObject )
{
this.shape = null;

this.shipObject = shipObject;

this.speed = 8;

    // draw the bullet
this.drawBullet();


STAGE.addChild( this.shape );


Bullets.all.push( this );
}


Bullets.all = [];




Bullets.prototype.drawBullet = function()
{
    // do this
};



Bullets.moveForwardBullets = function()
{
var all = Bullets.all;

var bulletObject, shape;
var rotation;

var i;


for (i = 0 ; i < all.length ; i++)
    {
    bulletObject = all[i];
    
    shape = bulletObject.shape;
    
    
        //HERE
    rotation = shape.rotation - 90;
    
    shape.x += Math.sin( rotation * (Math.PI/-180) ) * bulletObject.speed;
    shape.y += Math.cos( rotation * (Math.PI/-180) ) * bulletObject.speed;
    
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
var x = bulletObject.shape.x;
var y = bulletObject.shape.y;

if (x < 0 || x > CANVAS.width || y < 0 || y > CANVAS.height)
    {
    return true;
    }

return false;
};



Bullets.remove = function( position )
{
STAGE.removeChild( Bullets.all[ position ].shape );

Bullets.all.splice( position, 1 );
};



Bullets.tick = function()
{
Bullets.moveForwardBullets();
};


    // public stuff
window.Bullets = Bullets;

}(window));