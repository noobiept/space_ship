/*global INHERIT_PROTOTYPE, EnemyShip*/
/*jslint vars: true, white: true*/

"use strict";



function EnemyMoveHorizontally()
{
this.shipBody = null;

    // inhirit from EnemyShip class
EnemyShip.call( this );


this.damage = EnemyMoveHorizontally.damage;
this.velocity = EnemyMoveHorizontally.velocity;

this.width = 20;
this.height = 20;
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
            frames: [0, 1, 2],
            next: "spawn",
            frequency: 10
            },
        
        main: {
            
            frames: [ 3 ],
            next: "main",
            frequency: 10
            },
        
        },
        
    frames: {
        
        width: 20,
        height: 20
        },
        
    images: [ "images/enemy_move_horizontally.png" ]
    };
    
var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );


    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shipBody = enemy;
};




EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
this.x += this.velocity;
};


