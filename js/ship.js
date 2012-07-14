/*global Container, Shape, CANVAS, KEYS_HELD, EnemyShip, ENERGY: true, ENERGY_TEXT, STAGE, $, Ticker, EVENT_KEY, startGame, Text*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{

function Ship()
{
this.initialize();
}

Ship.all = [];


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

Ship.all.push( this );
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
 
     
Ship.checkIfCollidedWithEnemies = function()
{
var i, k;
var enemies = EnemyShip.all;



var ship;
var enemy;

var shipLeftSide, shipRightSide, shipUpSide, shipDownSide;
var enemyLeftSide, enemyRightSide, enemyUpSide, enemyDownSide;

for (k = 0 ; k < Ship.all.length ; k++)
    {
    ship = Ship.all[k];
    
    shipLeftSide = ship.x - 5;
    shipRightSide = ship.x + 5;
    shipUpSide = ship.y - 5;
    shipDownSide = ship.y + 5;
    
    for (i = 0 ; i < enemies.length ; i++)
        {
        enemy = enemies[i];
            
            // we'll assume a square of the impact area
        enemyLeftSide = enemy.x - 10;
        enemyRightSide = enemy.x + 10;
        enemyUpSide = enemy.y - 10;
        enemyDownSide = enemy.y + 10;
        
            // check if they collide
        if ( !(shipRightSide < enemyLeftSide || shipLeftSide > enemyRightSide || shipDownSide < enemyUpSide || shipUpSide > enemyDownSide) )
            {
            ship.tookDamage( enemy.damageGiven() );

                // if so, remove the enemy, and reduce the energy
            enemy.remove( i );
            
                // the array changed in length (since we removed one element. Update the index)
            i--;
            }
        }
    }

};


Ship.prototype.tookDamage = function( damage )
{
var energy = GameStatistics.getShipEnergy() - damage;

GameStatistics.updateShipEnergy( energy );


    // you loose
if (energy <= 0)
    {
    STAGE.removeChild( this );
    
    Ticker.removeAllListeners();
    
    $( document).bind( "keyup", function(event) 
        {
        if (event.keyCode === EVENT_KEY.enter) 
            {
            startGame();
            }
        });
    
    
    var gameOver = new Text("Game Over: Press enter to restart", "16px Arial", "rgb(255, 255, 255)");
    
    gameOver.textAlign = "center";
    
    gameOver.x = CANVAS.width / 2;
    gameOver.y = CANVAS.height / 2;
    
    STAGE.addChild( gameOver );
    
    STAGE.update();
    }
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

    
Ship.checkIfCollidedWithEnemies();    
};
    
window.Ship = Ship;

}(window));

