/*global Container, Shape, CANVAS, KEYS_HELD*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{

function Ship()
{
this.initialize();
}

var p = Ship.prototype = new Container();

var VELOCITY = 5;


    // unique to avoid overiding base class
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

g.beginStroke( "rgb(255, 255, 255)" );

g.moveTo( -5, -5 );
g.lineTo( -5, 5 );
g.lineTo( 5, 0 );
g.lineTo( -5, -5 );

g.closePath();
};
 
 
Ship.inTopLimit = function( y )
{
if (y < 0)
    {
    return true;
    }

return false;
};
 
 

Ship.inLeftLimit = function( x )
{
if (x < 0)
    {
    return true;
    }

return false;
};


Ship.inRightLimit = function( x )
{
if (x > CANVAS.width)
    {
    return true;
    }

return false;
};
 


Ship.inBottomLimit = function( y )
{
if (y > CANVAS.height)
    {
    return true;
    }

return false;
};
 
     
    
    
p.tick = function()
{
var nextX, nextY;

    // top left
if (KEYS_HELD.left && KEYS_HELD.up)
    {
    nextX = this.x - VELOCITY;
    nextY = this.y - VELOCITY;
    
    if ( !Ship.inTopLimit( nextY ) )
        {
        this.y = nextY;
        }
    
    if ( !Ship.inLeftLimit( nextX ) )
        {
        this.x = nextX;
        }
    }
    
    // bottom left
else if (KEYS_HELD.left && KEYS_HELD.down)
    {
    nextX = this.x - VELOCITY;
    nextY = this.y + VELOCITY;
    
    if ( !Ship.inLeftLimit( nextX ) )
        {
        this.x = nextX;
        }
        
    if ( !Ship.inBottomLimit( nextY ) )
        {
        this.y = nextY;
        }
    }
    
    // top right
else if (KEYS_HELD.right && KEYS_HELD.up)
    {
    nextX = this.x + VELOCITY;
    nextY = this.y - VELOCITY;
    
    if ( !Ship.inRightLimit( nextX ) )
        {
        this.x = nextX;
        }
        
    if ( !Ship.inTopLimit( nextY ) )
        {
        this.y = nextY;
        }
    }
    
    // bottom right
else if (KEYS_HELD.right && KEYS_HELD.down)
    {
    nextX = this.x + VELOCITY;
    nextY = this.y + VELOCITY;
    
    if ( !Ship.inRightLimit( nextX ) )
        {
        this.x = nextX;
        }
        
    if ( !Ship.inBottomLimit( nextY ) )
        {
        this.y = nextY;
        }
    }

    // left
else if(KEYS_HELD.left)
    {
    nextX = this.x - VELOCITY;
    
    if ( !Ship.inLeftLimit( nextX ) )
        {
        this.x = nextX;
        }
    }
    
    // right
else if (KEYS_HELD.right)
    {
    nextX = this.x + VELOCITY;
    
    if ( !Ship.inRightLimit( nextX ) )
        {
        this.x = nextX;
        }
    }
    
    // top
else if (KEYS_HELD.up)
    {
    nextY = this.y - VELOCITY;
    
        // check if is within the canvas (in bounds)
    if ( !Ship.inTopLimit( nextY ) )
        {
        this.y = nextY;
        }
    }
    
    // bottom
else if (KEYS_HELD.down)
    {
    nextY = this.y + VELOCITY;
    
    if ( !Ship.inBottomLimit( nextY ) )
        {
        this.y = nextY;
        }
    }
};
    
window.Ship = Ship;

}(window));

