"use strict";


function Weapon3_rocket( shipObject )
{
this.width = 15;
this.height = 7;

    // inherit from the Weapons class
Weapons.call( this, shipObject );

this.damage = 20;
this.speed = 7;

applyImpulse( this.body, shipObject.getRotation(), this.speed * this.body.GetMass() );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon3_rocket, Weapons );



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

var sprite = new createjs.SpriteSheet( rocketSprite );
    
var rocket = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
rocket.regX = this.width / 2;
rocket.regY = this.height / 2;

rocket.gotoAndPlay("main");


var shipObject = this.shipObject;

rocket.x = shipObject.getX();
rocket.y = shipObject.getY();
rocket.rotation = shipObject.getRotation();

this.shape = rocket;
};  