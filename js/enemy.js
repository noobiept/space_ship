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
        
    Arguments:
    
        tick_function : reference to a function, that gets called in the .tick() function
 */

function EnemyShip( tick_function )
{
    // damage given by this ship when it hits
this.damage = 10;

this.velocity = 1;

this.width = 20;
this.height = 20;

this.shipBody = null;

    // to distinguish the bullets (from enemies or from the main ship)
this.isEnemy = true;

if (typeof tick_function == "undefined")
    {
    this.tick_function = null;
    }

else
    {
    this.tick_function = tick_function;
    }


this.initialize();
}


EnemyShip.all = [];



var p = EnemyShip.prototype = new Container();


p.Container_initialize = p.initialize;


p.initialize = function()
{
this.Container_initialize();

this.shipBody = new Shape();

    // draw the shape
this.makeShape();


    // add to Container()
this.addChild( this.shipBody );



EnemyShip.all.push( this );


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



p.remove = function( position )
{
STAGE.removeChild( this );

Ticker.removeListener( this );

EnemyShip.all.splice( position, 1 );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
};



p.tick = function()
{
this.shipBehaviour();


    // the limits of the canvas
this.checkLimits();

if (this.tick_function !== null)
    {
    this.tick_function();
    }
};


window.EnemyShip = EnemyShip;

}(window));