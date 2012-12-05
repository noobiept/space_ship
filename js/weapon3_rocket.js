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

/*global Weapons, INHERIT_PROTOTYPE, SpriteSheet, BitmapAnimation*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon3_rocket( shipObject )
{
this.width = 15;
this.height = 7;

    // inherit from the Weapons class
Weapons.call( this, shipObject );

applyImpulse( this.body, shipObject.getRotation(), 0.6 );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon3_rocket, Weapons );



Weapon3_rocket.prototype.drawBullet = function()
{
var rocketSprite = {

    animations: {
    
        main: {
            frames: [ 0, 1 ],
            next: "main"
            }
        },
        
    frames: {
        width: 15,
        height: 7
        },
        
    images: [ "images/weapon3_rocket.png" ]
    };

var sprite = new createjs.SpriteSheet( rocketSprite );
    
var rocket = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
rocket.regY = this.height / 2;

rocket.gotoAndPlay("main");


var shipObject = this.shipObject;

rocket.x = shipObject.getX();
rocket.y = shipObject.getY();
rocket.rotation = shipObject.getRotation();

this.shape = rocket;
};  