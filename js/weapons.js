/*
    Copyright - 2012 - Pedro Ferreira

    This file is part of space_ship_game.

    space_ship_game is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    space_ship_game is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with space_ship_game.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global Shape, STAGE, CANVAS, ZIndex, Ticker, GAME_WIDTH, GAME_HEIGHT*/
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
    
        .bulletShape
        
    Arguments:
    
        shipObject    : of the ship which fired the bullet
        angleRotation : of the bullet
 */

function Weapons( shipObject, angleRotation )
{
this.bulletShape = null;

this.shipObject = shipObject;


    // draw the bullet
this.drawBullet( angleRotation );

this.isEnemy = shipObject.isEnemy;

STAGE.addChild( this.bulletShape );

ZIndex.update();

Ticker.addListener( this );


if ( this.isEnemy )
    {
    Weapons.enemyBullets.push( this );
    }

else
    {
    Weapons.allyBullets.push( this );
    }
}

    // all the bullets from the enemies
Weapons.enemyBullets = [];

    // all the bullets from the allies
Weapons.allyBullets = [];



Weapons.prototype.drawBullet = function( angleRotation )
{
    // do this
};





Weapons.prototype.moveForwardBullet = function()
{
var shape = this.bulletShape;


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

Weapons.prototype.reachedLimits = function()
{
var x = this.bulletShape.x;
var y = this.bulletShape.y;

if (x < 0 || x > GAME_WIDTH || y < 0 || y > GAME_HEIGHT)
    {
    return true;
    }

return false;
};


/*
    Remove the bullet from the stage
 */

Weapons.prototype.remove = function()
{
var all;

if ( this.isEnemy )
    {
    all = Weapons.enemyBullets;
    }
    
else
    {
    all = Weapons.allyBullets;
    }
    
STAGE.removeChild( this.bulletShape );
Ticker.removeListener( this );


var position = all.indexOf( this );

all.splice( position, 1 );
};


/*
    Remove all bullets 
 */

Weapons.removeAllBullets = function()
{
$( Weapons.enemyBullets ).each(function(index, enemy)
    {
    enemy.remove();
    });
    
$( Weapons.allyBullets ).each(function(index, ally)
    {
    ally.remove();
    });
};



Weapons.prototype.tick = function()
{
this.moveForwardBullet();


if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};




    // public stuff
window.Weapons = Weapons;

}(window));