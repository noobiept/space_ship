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

/*global EnemyShip, INHERIT_PROTOTYPE, BitmapAnimation, SpriteSheet, MAIN_SHIP, $*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyKamikaze()
{
this.shape = null;

this.damage = EnemyKamikaze.damage;
this.velocity = EnemyKamikaze.velocity;

this.width = 14;
this.height = 14;

    // inherits from the Enemy class
EnemyShip.call( this );
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyKamikaze, EnemyShip );


EnemyKamikaze.damage = 10;
EnemyKamikaze.velocity = 2;



EnemyKamikaze.prototype.makeShape = function()
{
var spriteSheet = {
    animations: {
        
        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: 10
            },
        main: {
            frames: [ 3 ],
            next: "main",
            frequency: 10
            }
        },
    frames: {
        width: this.width,
        height: this.height
        },
    images: [ "images/enemy_kamikaze.png" ]
    };

var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );

    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};


EnemyKamikaze.prototype.shipBehaviour = function()
{
var shipX = MAIN_SHIP.x;
var shipY = MAIN_SHIP.y;

var enemyX = this.x;
var enemyY = this.y;

    // sometimes enemyY is NaN.. don't know why, so just return when that happens
if (isNaN(enemyY) === true)
    {
    return;
    }


    // y = slope * x + b
var slope = (enemyY - shipY) / (enemyX - shipX);
    
    // sometimes you don't get a number (the division)
if ( $.isNumeric( slope ) === false )
    {
    return;
    }

    
var b = enemyY - slope * enemyX;
    
var newEnemyX;
    
if ( (enemyX - shipX) > 0 )
    {
    newEnemyX = enemyX - this.velocity;
    }

else
    {
    newEnemyX = enemyX + this.velocity;
    }


    
var newEnemyY = slope * newEnemyX + b;



var limit = newEnemyY - enemyY;

    // slow down the y variation
if (limit > this.velocity)
    {
    newEnemyY = enemyY + this.velocity - 1;
    }

else if (limit < -this.velocity )
    {
    newEnemyY = enemyY - this.velocity - 1;
    }

    
this.x = newEnemyX;
this.y = newEnemyY;
    
    
this.updateRotation();
};



EnemyKamikaze.prototype.beforeAddToStage = function()
{
this.updateRotation();
};



/*
    Updates the rotation property so that the enemy ship points at the main ship
 */

EnemyKamikaze.prototype.updateRotation = function()
{
    // calculate the angle between the enemy and the ship  
var angleDegrees = this.calculateAngleBetweenShip();

    //HERE align the image
angleDegrees += 90;

    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
this.rotation = -1 * angleDegrees; 
};



EnemyKamikaze.prototype.spawnTick_function = function()
{
this.updateRotation();
};
