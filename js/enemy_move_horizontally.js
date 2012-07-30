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


EnemyMoveHorizontally.damage = 10;
EnemyMoveHorizontally.velocity = 1;




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
    
var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );


    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};




EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
this.x += this.velocity;
};


