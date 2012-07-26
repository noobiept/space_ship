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
        .width
        .height
        
    Add reference of the drawn element to:
    
        .shape
        
    Arguments:
    
        shipObject    : of the ship which fired the bullet
        angleRotation : of the bullet
 */

function Bullets( shipObject, angleRotation )
{
this.shape = null;

this.shipObject = shipObject;


    // draw the bullet
this.drawBullet( angleRotation );

this.isEnemy = shipObject.isEnemy;

STAGE.addChild( this.shape );

ZIndex.update();

Ticker.addListener( this );


if ( this.isEnemy )
    {
    Bullets.enemies.push( this );
    }

else
    {
    Bullets.allies.push( this );
    }
}

    // all the bullets from the enemies
Bullets.enemies = [];

    // all the bullets from the allies
Bullets.allies = [];



Bullets.prototype.drawBullet = function( angleRotation )
{
    // do this
};





Bullets.prototype.moveForwardBullet = function()
{
var shape = this.shape;


    //HERE
var rotation = shape.rotation - 90;

shape.x += Math.sin( rotation * (Math.PI/-180) ) * this.speed;
shape.y += Math.cos( rotation * (Math.PI/-180) ) * this.speed;

    // remove the bullets that are out of the canvas
if ( this.reachedLimits() )
    {
    this.remove();
    }
};



/*
    Tells if a bullet has reached the canvas limits
 */

Bullets.prototype.reachedLimits = function()
{
var x = this.shape.x;
var y = this.shape.y;

if (x < 0 || x > GAME_WIDTH || y < 0 || y > GAME_HEIGHT)
    {
    return true;
    }

return false;
};


/*
    Remove the bullet from the stage
 */

Bullets.prototype.remove = function()
{
var all;

if ( this.isEnemy )
    {
    all = Bullets.enemies;
    }
    
else
    {
    all = Bullets.allies;
    }
    
STAGE.removeChild( this.shape );
Ticker.removeListener( this );


var position = all.indexOf( this );

all.splice( position, 1 );
};




Bullets.prototype.tick = function()
{
this.moveForwardBullet();


if (typeof this.tick_function != "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};




    // public stuff
window.Bullets = Bullets;

}(window));