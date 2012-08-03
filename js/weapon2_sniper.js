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

/*global Weapons, INHERIT_PROTOTYPE, SpriteSheet, BitmapAnimation, STAGE, EnemyShip*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon2_sniper( shipObject )
{
this.width = 1000;
this.height = 2;

    // inherit from the Weapons class
Weapons.call( this, shipObject );

this.speed = 0; //HERE ser instantaneo?...

this.countTicks = Weapon2_sniper.numberTicksAnimation;

Weapon2_sniper.findIfIntercept( shipObject );
} 

    // number of ticks of the duration of the bullet animation, before removing it from the stage
Weapon2_sniper.numberTicksAnimation = 30;


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon2_sniper, Weapons );


Weapon2_sniper.prototype.drawBullet = function()
{
var sniperSprite = {
    
    animations: {
    
        main :  { 
            frames: [ 0 ],
            next : "main",
            frequency: 10
            }
        },
        
    frames: {
        width: 1000,
        height: 2
        },
        
    images: [ "images/weapon2_sniper.png" ]
    };

var sprite = new SpriteSheet( sniperSprite );

var sniper = new BitmapAnimation( sprite );

    // origin in the middle of the image
sniper.regY = this.height / 2;

sniper.gotoAndPlay( "main" );
    
    
var shipObject = this.shipObject;

sniper.x = shipObject.x;
sniper.y = shipObject.y;
sniper.rotation = shipObject.rotation;


this.bulletShape = sniper;
};




Weapon2_sniper.findIfIntercept = function(ship)
{

var mouseX = STAGE.mouseX;
var mouseY = STAGE.mouseY;

var shipX = ship.x;
var shipY = ship.y;

    // find the line equation: y = slope * x + b
var slope = (mouseY - shipY) / (mouseX - shipX);

var b = mouseY - slope * mouseX;

var enemies = EnemyShip.all;

var i;
var enemyX, enemyY;

for (i = 0 ; i < enemies.length ; i++)
    {
    enemyX = enemies[i].x;
    enemyY = enemies[i].y;
    
        // see if any enemy is on the path of the bullet
    
    //console.log(enemyY, slope * enemyX + b);
    
    var aa = slope * enemyX + b;
    
    
    
        //HERE tem k abranger uma area..
    if ( enemyY >= aa - 20 && enemyY <= aa + 20)
        {
        enemies[i].damageTaken();
        
        i--;
        }
    }
};


Weapon2_sniper.prototype.tick_function = function()
{
this.countTicks--;

if (this.countTicks <= 0)
    {
    this.remove();
    }
};