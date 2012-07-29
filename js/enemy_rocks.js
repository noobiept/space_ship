/*global EnemyShip, INHERIT_PROTOTYPE*/
/*jslint vars: true, white: true*/

"use strict";


function EnemyRocks()
{
this.shape = null;

this.damage = EnemyRocks.damage;
this.velocity = EnemyRocks.velocity;

this.width = 50;
this.height = 50;

    // inherits from the EnemyShip class
EnemyShip.call( this );
}


    // inherit the member functions
INHERIT_PROTOTYPE( EnemyRocks, EnemyShip );


EnemyRocks.damage = 5;
EnemyRocks.velocity = 1;



EnemyRocks.prototype.makeShape = function()
{
var spriteConfig = {
    animations: {
        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: 10
            },
        main: {
            frames: [ 3 ],
            next: "main",
            frequency: 10
            }
        },
    frames: {
        width: this.width,
        height: this.height
        },
    images: [ "images/enemy_rocks.png" ]
    };

var sprite = new SpriteSheet( spriteConfig );
    
var rock = new BitmapAnimation( sprite );

    // origin in the middle of the image
rock.regX = this.width / 2;
rock.regY = this.height / 2;

    // it moves 
this.angleRadians = getRandomFloat( 0, 2 * Math.PI );

rock.gotoAndPlay("spawn");

this.shape = rock;
};


//HERE mudar o nome para enemyBehaviour ou shapeBehaviour
EnemyRocks.prototype.shipBehaviour = function()
{
this.x += Math.sin( this.angleRadians ) * this.velocity;
this.y += Math.cos( this.angleRadians ) * this.velocity;
};






