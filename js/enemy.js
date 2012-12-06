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

/*global Container, Shape, CANVAS, STAGE, Ticker, GameStatistics, GAME_WIDTH, GAME_HEIGHT, MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";

/*
    This anonymous function, is to create a 'module', all functions/variables here are not available outside (apart from the ones we explicitly add to the window object)
 */

(function(window)
{

/*
    Don't use directly, use as a base class, and write these functions:
    
    --- to the prototype ---
    
        .makeShape()
        .setupPhysics()
        .shipBehaviour()
        .updateShape()          (optional)
        .tookDamage()           (optional)
        .beforeAddToStage()     (optional)
        .spawnTick_function()   (optional)
        .tick_function()        (optional)
        
    --- to the class ---

        .increaseDifficulty()
        .reset()
    
    and change these properties:
    
        .damage
        .velocity
        .width
        .height
        
    Add reference of the drawn element to:
    
        .shape

    Physics body

        .body
        
 */

function EnemyShip()
{
    // to distinguish the bullets (from enemies or from the main ship)
this.isEnemy = true;


this.type = TYPE_ENEMY;
   
    // the number of ticks it takes until the enemy can start moving/firing/being killed
this.spawnTicks_int = 20;


    // make the tick function deal with spawning the enemy
this.tick = this.spawningTick;


this.initialize();
}


EnemyShip.all = [];


var p = EnemyShip.prototype = new createjs.Container();


p.Container_initialize = p.initialize;


p.initialize = function()
{
this.Container_initialize();


    // draw the shape (spawn phase animation first)
this.makeShape();

this.setupPhysics();

    // add to Container()
this.addChild( this.shape );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() + 1 );
};




p.makeShape = function()
{
    // do this
};



p.setupPhysics = function()
{
    // do this
};


/*
    Updates the shape position to match the physic body
 */

p.updateShape = function()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


p.getPosition = function()
{
return {
    x: this.shape.x,
    y: this.shape.y
    };
};

p.getX = function()
{
return this.shape.x;
};


p.getY = function()
{
return this.shape.y;
};


p.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};



p.rotate = function( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};



EnemyShip.prototype.damageGiven = function()
{
return this.damage;
};


EnemyShip.prototype.tookDamage = function()
{
    // do this

    // just remove it (override this for something different)
this.remove();
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




p.checkLimits = function()
{
var x = this.getX();
var y = this.getY();

if (x < 0)
    {
    this.moveTo( GAME_WIDTH, y );
    }

else if (x > GAME_WIDTH)
    {
    this.moveTo( 0, y );
    }

else if (y < 0)
    {
    this.moveTo( x, GAME_HEIGHT );
    }

else if (y > GAME_HEIGHT)
    {
    this.moveTo( x, 0 );
    }
};


/*
    Calculates the angle in degrees between the enemy ship and the main ship
 */

p.calculateAngleBetweenShip = function()
{
    // make a triangle from the position the ship is in, relative to the enemy position
var triangleOppositeSide = MAIN_SHIP.shape.y - this.y;
var triangleAdjacentSide = this.x - MAIN_SHIP.shape.x;


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

createjs.Ticker.removeListener( this );


WORLD.DestroyBody( this.body );

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

this.updateShape();

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