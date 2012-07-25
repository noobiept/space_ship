/*global Container, Shape, Bullets, CANVAS, STAGE, Ticker, GameStatistics*/
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
    
        .shipBody
        
    Possible properties:
    
        .spawnTick_function : reference to a function that is called in the .tick() during the spawn of the enemy
        .tick_function      : reference to a function that is called in the .tick() after the spawn (in the normal behaviour)
        
 */

function EnemyShip()
{
    // damage given by this ship when it hits
this.damage = 10;

this.velocity = 1;

this.width = 20;
this.height = 20;

this.shipBody = null;

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
this.addChild( this.shipBody );


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
}


EnemyShip.prototype.damageTaken = function( position )
{
    //HERE for now just remove it
this.remove( position );
};



p.checkLimits = function()
{
var width = CANVAS.width;
var height = CANVAS.height;


if (this.x < 0)    
    {
    this.x = width;
    }

else if (this.x > width)
    {
    this.x = 0;
    }

else if (this.y < 0)
    {
    this.y = height;
    }

else if (this.y > height)
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

p.remove = function( position )
{
STAGE.removeChild( this );

Ticker.removeListener( this );

EnemyShip.all.splice( position, 1 );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
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
    this.shipBody.gotoAndPlay("main");
    
        // only add now to the enemies list (so, only from now on will the bullets be able to kill it, etc)
    EnemyShip.all.push( this );
    
        // now execute the normal tick function
    this.tick = this.normalTick;
    }
    
if (typeof this.spawnTick_function != "undefined" && this.spawnTick_function !== null)
    {  
    this.spawnTick_function();
    }
}


p.normalTick = function()
{
this.shipBehaviour();


    // the limits of the canvas
this.checkLimits();

if (typeof this.tick_function != "undefined" && this.tick_function !== null)
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