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

/*global INHERIT_PROTOTYPE, EnemyShip, SpriteSheet, BitmapAnimation*/
/*jslint vars: true, white: true*/

"use strict";



function EnemyMoveHorizontally()
{
this.shape = null;

this.damage = EnemyMoveHorizontally.damage;
this.velocity = EnemyMoveHorizontally.velocity;

this.width = 20;
this.height = 20;

    // inhirit from EnemyShip class
EnemyShip.call( this );
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyMoveHorizontally, EnemyShip);


EnemyMoveHorizontally.damage_default = 10;
EnemyMoveHorizontally.velocity_default = 1;

EnemyMoveHorizontally.damage = EnemyMoveHorizontally.damage_default;
EnemyMoveHorizontally.velocity = EnemyMoveHorizontally.velocity_default;




EnemyMoveHorizontally.prototype.makeShape = function()
{
var spriteSheet = {

    animations: {
        
        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: 10
            },
        
        main: {
            
            frames: [ 3, 4 ],
            next: "main",
            frequency: 10
            }
        
        },
        
    frames: {
        
        width: this.width,
        height: this.height
        },
        
    images: [ "images/enemy_move_horizontally.png" ]
    };
    
var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.BitmapAnimation( ss );


    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

createjs.Tween.get( enemy, { loop: true } ).to( { alpha: 0.4 }, 200, createjs.Ease.get(1) )
                                  .to( { alpha: 1   }, 200, createjs.Ease.get(1) );  //HERE 

this.shape = enemy;
};



EnemyMoveHorizontally.prototype.setupPhysics = function()
{
var width = this.width;
var height = this.height;

    // physics
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2PolygonShape;

    // arguments: half width, half height
fixDef.shape.SetAsBox( width / 2 / SCALE, height / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );


body.SetUserData( this );

this.body = body;
};





EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
var nextX = this.shape.x + this.velocity;
var nextY = this.shape.y;

this.moveTo( nextX, nextY );
};


EnemyMoveHorizontally.increaseDifficulty = function()
{
EnemyMoveHorizontally.damage++;
EnemyMoveHorizontally.velocity++;
};


EnemyMoveHorizontally.reset = function()
{
EnemyMoveHorizontally.damage = EnemyMoveHorizontally.damage_default;
EnemyMoveHorizontally.velocity = EnemyMoveHorizontally.velocity_default;
};