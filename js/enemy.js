/*global Container, Shape, Bullets, CANVAS, STAGE, Ticker, GameStatistics*/
/*jslint vars: true, white: true*/

"use strict";

/*
    This anonymous function, is to create a 'module', all functions/variables here are not available outside (apart from the ones we explicitly add to the window object)
 */

(function(window)
{

function EnemyShip()
{
this.initialize();

    // damage given by this ship when it hits
this.damage = 10;

this.velocity = 1;
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
var g = this.shipBody.graphics;

g.clear();

g.beginStroke( "rgb(255, 0, 0)" );

this.width = 20;
this.height = 20;

g.moveTo( -10, -10 );
g.lineTo( 10, -10 );
g.lineTo( 10, 10 );
g.lineTo( -10, 10 );
g.lineTo( -10, -10 );

g.closePath();
};



/*
    See if it was hit by the bullets
 */

p.wasHit = function()
{
var bullets = Bullets.all;

var bulletX, bulletY;

var i;

var bulletLeftSide, bulletRightSide, bulletUpSide, bulletDownSide;
var enemyLeftSide, enemyRightSide, enemyUpSide, enemyDownSide;


for (i = 0 ; i < bullets.length ; i++)
    {
    bulletX = bullets[i].x;
    bulletY = bullets[i].y;
    
    
        // a bullet is a two pixel line
        // to simplify, lets use a square for the collision detection
    bulletLeftSide = bulletX - 1;
    bulletRightSide = bulletX + 1;
    bulletUpSide = bulletY - 1;
    bulletDownSide = bulletY + 1;
    
        // the ship is centered on 0
    var halfWidth = this.width / 2;
    var halfHeight = this.height / 2; 
    
        // same for the enemy
    enemyLeftSide = this.x - halfWidth;
    enemyRightSide = this.x + halfWidth;
    enemyUpSide = this.y - halfHeight;
    enemyDownSide = this.y + halfHeight;

        // check if it hits the EnemyShip
    if ( !(bulletRightSide < enemyLeftSide || bulletLeftSide > enemyRightSide || bulletDownSide < enemyUpSide || bulletUpSide > enemyDownSide) )
        {
            // remove the bullet
        Bullets.remove( i );
        
            // remove the EnemyShip
        this.remove( i );
        
        return;   
        }
    }
};



EnemyShip.prototype.damageGiven = function()
{
return this.damage;
};


EnemyShip.prototype.shipBehaviour = function()
{
this.x += this.velocity;
};


p.tick = function()
{
this.shipBehaviour();

    // check if it was hit
this.wasHit();

    // the limits of the canvas
this.checkLimits();
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


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies
() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
};


window.EnemyShip = EnemyShip;

}(window));