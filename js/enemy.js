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


var p = EnemyShip.prototype = new Container();


p.Container_initialize = p.initialize;


p.initialize = function()
{
this.Container_initialize();

this.shipBody = new Shape();


this.addChild( this.shipBody );

this.makeShape();
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

for (i = 0 ; i < bullets.length ; i++)
    {
    bulletX = bullets[i].x;
    bulletY = bullets[i].y;
    
        // check if it hits the EnemyShip (the x part)
    if ((bulletX > this.x - 10) && (bulletX < this.x + 10))
        {
            // now the y part
        if ((bulletY > this.y - 10) && (bulletY < this.y + 10))
            {
                // remove the bullet
            Bullets.remove( i );
            
                // remove the EnemyShip
            this.remove();
            
            return;
            }
        }
    }
};


var VELOCITY = 6;

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



p.remove = function()
{
STAGE.removeChild( this.shipBody );
STAGE.removeChild( this );

Ticker.removeListener( this );
};


window.EnemyShip = EnemyShip;

}(window));