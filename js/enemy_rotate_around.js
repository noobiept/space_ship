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

/*global EnemyShip, INHERIT_PROTOTYPE, MAIN_SHIP, SpriteSheet, BitmapAnimation, Weapon1_laser*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRotateAround()
{
this.shape = null;

this.damage = EnemyRotateAround.damage;
this.velocity = EnemyRotateAround.velocity;

this.width = 20;
this.height = 20;

    // inherits from the Enemy class
EnemyShip.call( this );


this.ticksUntilNextBullet = 50;

this.countTicks = 0;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyRotateAround, EnemyShip);



EnemyRotateAround.damage = 10;
EnemyRotateAround.velocity = 1;




EnemyRotateAround.prototype.makeShape = function()
{
var spriteSheet = {

    animations: {
        
        spawn: {
            frames: [0, 1, 2],
            next: "spawn",
            frequency: 10
            },

        main: {   
            frames: [3, 4],
            next: "main",    // set up looping
            frequency: 10
            }
        },
        
    frames: {
        
        width: this.width,
        height: this.height
        },
        
    images: [ "images/enemy_rotate_around_ship.png" ]

    };
    
var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );

    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};




EnemyRotateAround.prototype.shipBehaviour = function()
{
    // make a triangle from the position the ship is in, relative to the enemy position
var triangleOppositeSide = MAIN_SHIP.y - this.y;
var triangleAdjacentSide = this.x - MAIN_SHIP.x;



    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );


this.x += Math.sin( angleRadians ) * this.velocity;
this.y += Math.cos( angleRadians ) * this.velocity;
};



/*
    Gets called in the base class .tick() function
    
    Shoots the bullets
 */

EnemyRotateAround.prototype.tick_function = function()
{
this.countTicks++;

    // fire a new bullet
if (this.countTicks >= this.ticksUntilNextBullet)
    {
    this.countTicks = 0;
    
    var angleRotation = this.calculateAngleBetweenShip();
    
    
        //HERE align the image
    angleRotation += 180;
       
    
        // we multiply by -1 because the .rotation property seems to have the angles in the other direction
    angleRotation *= -1;
      
    new Weapon1_laser( this, angleRotation );
    }
};
