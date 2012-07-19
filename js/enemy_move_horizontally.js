/*global INHERIT_PROTOTYPE, EnemyShip*/
/*jslint vars: true, white: true*/

"use strict";



function EnemyMoveHorizontally()
{
    // inhirit from EnemyShip class
EnemyShip.call( this );

this.shipBody = null;

this.damage = 10;
this.velocity = 1;

this.width = 20;
this.height = 20;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyMoveHorizontally, EnemyShip);



EnemyMoveHorizontally.prototype.makeShape = function()
{
var spriteSheet = {

    animations: {
        main: {
            
            frames: [0],
            next: "main"//,
            //frequency: 10
            }
        },
        
    frames: {
        
        width: 20,
        height: 20
        },
        
    images: [ "images/enemy_move_horizontally.png" ]
    };
    
var ss = new SpriteSheet( spriteSheet );

var enemy = new BitmapAnimation( ss );


enemy.gotoAndPlay("main");

this.shipBody = enemy;
};



EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
this.x += this.velocity;
};


