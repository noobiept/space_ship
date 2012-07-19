/*global EnemyShip, INHERIT_PROTOTYPE, MAIN_SHIP, SpriteSheet, BitmapAnimation*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRotateAround()
{
    // inherits from the Enemy class
EnemyShip.call( this );

this.shipBody = null;

this.damage = 10;
this.velocity = 1;

this.width = 20;
this.height = 20;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyRotateAround, EnemyShip);





EnemyRotateAround.prototype.makeShape = function()
{
var spriteSheet = {

    animations: {
        rotate: {
            
            frames: [0, 1],
            next: "rotate",    // set up looping
            frequency: 10
            
            }
        },
        
    frames: {
        
        width: 20,
        height: 20
        },
        
    images: [ "images/enemy_rotate_around_ship.png" ]

    };
    
var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );


enemy.gotoAndPlay("rotate");

this.shipBody = enemy;
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
