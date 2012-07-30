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

/*global Container, Shape, Bullets, CANVAS, STAGE, Ticker, GameStatistics, GAME_WIDTH, GAME_HEIGHT, MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";

/*
    This anonymous function, is to create a 'module', all functions/variables here are not available outside (apart from the ones we explicitly add to the window object)
 */

(function(window)
{

/*
    Don't use directly, use as a base class, and write these functions:
    
        .makeShape()
        .shipBehaviour()
        
    and change these properties:
    
        .damage
        .velocity
        .width
        .height
        
    Add reference of the drawn element to:
    
        .shape
        
    Possible properties:
    
        .spawnTick_function : reference to a function that is called in the .tick() during the spawn of the enemy
        .tick_function      : reference to a function that is called in the .tick() after the spawn (in the normal behaviour)
        
    Override is necessary:
    
        .damageTaken()
        
 */

function EnemyShip()
{
    // to distinguish the bullets (from enemies or from the main ship)
this.isEnemy = true;

   
    // the number of ticks it takes until the enemy can start moving/firing/being killed
this.spawnTicks_int = 20;


    // make the tick function deal with spawning the enemy
this.tick = this.spawningTick;


this.initialize();
}


EnemyShip.all = [];



var p = EnemyShip.prototype = new Container();


p.Container_initialize = p.initialize;


p.initialize = function()
{
this.Container_initialize();


    // draw the shape (spawn phase animation first)
this.makeShape();


    // add to Container()
this.addChild( this.shape );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() + 1 );
};




p.makeShape = function()
{
    // do this
};






EnemyShip.prototype.damageGiven = function()
{
return this.damage;
};


EnemyShip.prototype.shipBehaviour = function()
{
    // do this
};


/*
    Its called right before the enemy is added to the Stage
 */

EnemyShip.prototype.beforeAddToStage = function()
{
    // do this
};


EnemyShip.prototype.damageTaken = function()
{
    // just remove it (override this for something different)
this.remove();
};



p.checkLimits = function()
{
if (this.x < 0)    
    {
    this.x = GAME_WIDTH;
    }

else if (this.x > GAME_WIDTH)
    {
    this.x = 0;
    }

else if (this.y < 0)
    {
    this.y = GAME_HEIGHT;
    }

else if (this.y > GAME_HEIGHT)
    {
    this.y = 0;
    }
};


/*
    Calculates the angle in degrees between the enemy ship and the main ship
 */

p.calculateAngleBetweenShip = function()
{
    // make a triangle from the position the ship is in, relative to the enemy position
var triangleOppositeSide = MAIN_SHIP.y - this.y;
var triangleAdjacentSide = this.x - MAIN_SHIP.x;


    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );
    
    // convert to degrees
var angleDegrees = angleRadians * 180 / Math.PI;

return angleDegrees;
};



/*
    Remove the enemy ship, and update the game statistics
 */

p.remove = function()
{
STAGE.removeChild( this );

Ticker.removeListener( this );

var position = EnemyShip.all.indexOf( this );

EnemyShip.all.splice( position, 1 );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
};



/*
    Remove everything
 */

EnemyShip.removeAll = function()
{
$( EnemyShip.all ).each(function(index, ship)
    {
    ship.remove( index );
    });
};



/*
    The idea here is to have a time when the enemy ship can't do damage (or receive), since its still spawning.
    This prevents problems like a ship spawning right under the main ship (and so taking damage without any chance to prevent it)
 */

EnemyShip.prototype.spawningTick = function()
{
this.spawnTicks_int--;


if (this.spawnTicks_int < 0)
    {  
        // play the main animation
    this.shape.gotoAndPlay("main");
    
        // only add now to the enemies list (so, only from now on will the bullets be able to kill it, etc)
    EnemyShip.all.push( this );
    
        // now execute the normal tick function
    this.tick = this.normalTick;
    }
    
if (typeof this.spawnTick_function !== "undefined" && this.spawnTick_function !== null)
    {  
    this.spawnTick_function();
    }
};


p.normalTick = function()
{
this.shipBehaviour();


    // the limits of the canvas
this.checkLimits();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};


p.tick = function()
{
    // this will point to spawningTick() or normalTick()
};


window.EnemyShip = EnemyShip;

}(window));