/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon3_rocket( shipObject )
{
this.width = 15;
this.height = 7;

    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 4;
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon3_rocket, Bullets );



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

var sprite = new SpriteSheet( rocketSprite );
    
var rocket = new BitmapAnimation( sprite );

    // origin in the middle of the image
rocket.regX = this.width / 2;
rocket.regY = this.height / 2;

rocket.gotoAndPlay("main");


var shipObject = this.shipObject;

rocket.x = shipObject.x;
rocket.y = shipObject.y;
rocket.rotation = shipObject.rotation;

this.shape = rocket;
};  