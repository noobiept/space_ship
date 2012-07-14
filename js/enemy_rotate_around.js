/*global EnemyShip, INHERIT_PROTOTYPE, MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRotateAround()
{
    // inherits from the Enemy class
EnemyShip.call( this );

this.shipBody = null;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyRotateAround, EnemyShip);





EnemyRotateAround.prototype.makeShape = function()
{
this.width = 20;
this.height = 20;

var spriteSheet = {

    animations: {
        rotate: {
            
            frames: [0, 1],
            next: "rotate",
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

    // set up looping
ss.getAnimation("rotate").next = "rotate";

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
