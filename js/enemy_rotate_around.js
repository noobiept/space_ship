/*global EnemyShip, INHERIT_PROTOTYPE, MAIN_SHIP, SpriteSheet, BitmapAnimation*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRotateAround()
{
    // inherits from the Enemy class
EnemyShip.call( this );

this.shipBody = null;

this.damage = EnemyRotateAround.damage;
this.velocity = EnemyRotateAround.velocity;

this.width = 20;
this.height = 20;


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

    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

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
