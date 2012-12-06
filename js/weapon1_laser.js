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

/*global Weapons, INHERIT_PROTOTYPE, $, SpriteSheet, BitmapAnimation*/
/*jslint vars:true, white: true*/

"use strict";

function Weapon1_laser( shipObject, angleRotation )
{
this.width = 4;
this.height = 2;


    // inherit from the Weapons class
Weapons.call( this, shipObject, angleRotation );

this.damage = 10;

applyImpulse( this.body, this.angleRotation, 10 * this.body.GetMass() );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon1_laser, Weapons );


Weapon1_laser.prototype.drawBullet = function( angleRotation )
{
var laserSprite = {
    
    animations: {
    
        main :  { 
            frames: [ 0, 1 ],
            next : "main",
            frequency: 10
            }
        },
        
    frames: {
        width: 4,
        height: 2
        },
        
    images: [ "images/weapon1_laser.png" ]
    
    };

var sprite = new createjs.SpriteSheet( laserSprite );

var laser = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
laser.regY = this.height / 2;

laser.gotoAndPlay( "main" );
    

laser.rotation = angleRotation;

this.shape = laser;
};
