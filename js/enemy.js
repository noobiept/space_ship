/*global Container, Shape, Bullets, CANVAS, STAGE, Ticker*/
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
}


EnemyShip.all = [];

var VELOCITY = 1;


    // damage given by this ship when it hits
EnemyShip.damage = 10;



var p = EnemyShip.prototype = new Container();


p.Container_initialize = p.initialize;


p.initialize = function()
{
this.Container_initialize();

this.shipBody = new Shape();


this.addChild( this.shipBody );

this.makeShape();

EnemyShip.all.push( this );
};



p.makeShape = function()
{
var g = this.shipBody.graphics;

g.clear();

g.beginStroke( "rgb(255, 0, 0)" );

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
    
        // same for the enemy
    enemyLeftSide = this.x - 10;
    enemyRightSide = this.x + 10;
    enemyUpSide = this.y - 10;
    enemyDownSide = this.y + 10;

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
return EnemyShip.damage;
};


p.tick = function()
{
this.x += VELOCITY;

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
};



p.remove = function( position )
{
STAGE.removeChild( this );

Ticker.removeListener( this );

EnemyShip.all.splice( position, 1 );

SCORE++;

SCORE_TEXT.text = "Enemies killed: " + SCORE;
};


window.EnemyShip = EnemyShip;

}(window));