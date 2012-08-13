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

/*global Container, Shape, CANVAS, KEYS_HELD, EnemyShip, ENERGY: true, ENERGY_TEXT, STAGE, $, Ticker, EVENT_KEY, startGame, Text, GameStatistics, SpriteSheet, GAME_WIDTH, GAME_HEIGHT, GameMenu, Weapon1_laser, Weapon2_sniper, Weapon3_rocket, Weapon4_mines, BitmapAnimation*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{

function Ship()
{
    // to distinguish the bullets (from enemies or from the main ship)
this.isEnemy = false;

this.initialize();
}

Ship.all = [];


var p = Ship.prototype = new Container();

var VELOCITY = 5;


    // ticks until we add + ammo to the weapons
    // the weapon number corresponds to the position in the list (position 0 is the first weapon, etc)
var AMMO_UPDATE_TICK = [
    10,
    50,
    20,
    25
    ];

    // and the correspondent counters
var TICK_COUNT = [
    AMMO_UPDATE_TICK[ 0 ],
    AMMO_UPDATE_TICK[ 1 ],
    AMMO_UPDATE_TICK[ 2 ],
    AMMO_UPDATE_TICK[ 3 ]
    ];
    

    // maximum number of bullets per weapon
var MAX_AMMO = [
        100,
        10,
        50,
        20
    ];


    // current number of bullets
var BULLETS_LEFT = [
        MAX_AMMO[0] / 2,
        MAX_AMMO[1] / 2,
        MAX_AMMO[2] / 2,
        MAX_AMMO[3] / 2
    ];



    // unique to avoid overiding base class
p.Container_initialize = p.initialize;



p.initialize = function()
{
this.Container_initialize();

this.shipBody = null;

this.width = 10;
this.height = 10;

this.makeShape();

this.addChild( this.shipBody );


this.weaponSelected = 1;

Ship.all.push( this );
};


p.makeShape = function()
{
var spriteSheet = {
    animations: {
        main: {
            frames: [ 0 ],
            next: "main"
            }
        },
    frames: {
        width: 10,
        height: 10
        },
    images: [ "images/ship.png" ]
    };


var ss = new SpriteSheet( spriteSheet );

var ship = new BitmapAnimation( ss );

ship.gotoAndPlay("main");

    // change the origin point to the middle, so that it rotates around the center (following the mouse)
ship.regX = this.width / 2;
ship.regY = this.height / 2;

this.shipBody = ship;
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
if (x > GAME_WIDTH)
    {
    return true;
    }

return false;
};
 


Ship.inBottomLimit = function( y )
{
if (y > GAME_HEIGHT)
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
            enemy.damageTaken();
            
                // the array changed in length (since we removed one element. Update the index)
            i--;
            }
        }
    }

};


Ship.prototype.damageTaken = function()
{
//HERE

this.tookDamage( 10 );
};


Ship.prototype.tookDamage = function( damage )
{
var energy = GameStatistics.getShipEnergy() - damage;

GameStatistics.updateShipEnergy( energy );


    // you loose
if (energy <= 0)
    {
    this.remove();
        
    Ticker.removeAllListeners();
    
    $( document).bind( "keyup", function(event) 
        {
        if (event.keyCode === EVENT_KEY.enter) 
            {
            GAME_MODE();
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
    
    
Ship.prototype.selectWeapon = function( weaponNumber )
{
this.weaponSelected = weaponNumber;

GameMenu.selectWeapon( weaponNumber ); 
};
    

/*
    Arguments:
    
        event : (MouseEvent -- easelJS)
        ship  : (Ship object)
 */
    
Ship.prototype.handleMouseMove = function( event )
{
if ( !event )
    {
    event = window.event;
    }


    // make a triangle from the position the ship is in, relative to the mouse position
var triangleOppositeSide = this.y - event.stageY;
var triangleAdjacentSide = event.stageX - this.x;


    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );

    // convert to degrees
var angleDegrees = angleRadians * 180 / Math.PI;



    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
this.rotation = -1 * angleDegrees;  
};
    
    
    
    
Ship.prototype.handleClick = function( event )  
{
if ( !event )
    {
    event = window.event;
    }

    
    // don't do anything when the menu is opened
if ( GameMenu.isOpened() )
    {
    return;
    }

var weapons = [ Weapon1_laser, Weapon2_sniper, Weapon3_rocket, Weapon4_mines ];

    // .weaponSelected starts at 1 for the first element (but arrsys start at 0)
var weaponSelected = this.weaponSelected - 1;


if (BULLETS_LEFT[ weaponSelected ] > 0)
    {
    new weapons[ this.weaponSelected - 1 ]( this );
    
    BULLETS_LEFT[ weaponSelected ]--;
    
    GameStatistics.updateBulletsLeft( weaponSelected );
    }
};
    

    
    
    
Ship.prototype.updateAmmo = function()
{
var i;

for (i = 0 ; i < AMMO_UPDATE_TICK.length ; i++)
    {
    TICK_COUNT[ i ]--;
    
    if (TICK_COUNT[ i ] <= 0)
        {
            // reset the counter
        TICK_COUNT[ i ] = AMMO_UPDATE_TICK[ i ];
        
            // if we still didn't reach the maximum value
        if (BULLETS_LEFT[ i ] < MAX_AMMO[ i ])
            {
                // increase the number of bullets available
            BULLETS_LEFT[ i ]++;
            
            GameStatistics.updateBulletsLeft( i );
            }
        }
    }
};
    
    
    
/* 
    Remove this ship
 */
    
p.remove = function()
{
Ticker.removeListener( this );
STAGE.removeChild( this );

var position = Ship.all.indexOf( this );

Ship.all.splice( position, 1 );

$( this ).unbind();
};


/*
    Remove all the ships
 */

Ship.removeAll = function()
{
$( Ship.all ).each(function(index, value)
    {
    value.remove();
    });
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

this.updateAmmo(); 
};
    

Ship.bulletsLeft = BULLETS_LEFT;
    
window.Ship = Ship;

}(window));

