/*global EnemyShip, INHERIT_PROTOTYPE, MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRotateAround()
{
    // inherits from the Enemy class
EnemyShip.call( this );

}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyRotateAround, EnemyShip);



EnemyRotateAround.prototype.getShipElement = function()
{
return this.spriteEnemy;
};


EnemyRotateAround.prototype.makeShape = function()
{
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

this.spriteEnemy = enemy;
/*
var g = this.shipBody.graphics;

g.clear();

g.beginStroke( "rgb(200, 100, 0)" );

g.moveTo( -5, -10 );
g.lineTo( 5, -10 );
g.lineTo( 10, -5 );
g.lineTo( 10, 5 );
g.lineTo( 5, 10 );
g.lineTo( -5, 10 );
g.lineTo( -10, 5 );
g.lineTo( -10, -5 );

g.closePath();*/
};




EnemyRotateAround.prototype.shipBehaviour = function()
{
var shipElement = this.getShipElement();



    // make a triangle from the position the ship is in, relative to the enemy position
var triangleOppositeSide = MAIN_SHIP.y - shipElement.y;
var triangleAdjacentSide = shipElement.x - MAIN_SHIP.x;



    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );


shipElement.x += Math.sin( angleRadians ) * shipElement.velocity;
shipElement.y += Math.cos( angleRadians ) * shipElement.velocity;


};
