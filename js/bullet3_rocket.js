"use strict";


function Bullet3_rocket( shipObject )
{
this.width = 15;
this.height = 7;

    // inherit from the Bullet class
Bullet.call( this, shipObject );

this.damage = 20;
this.speed = 7;

applyImpulse( this.body, shipObject.getRotation(), this.speed * this.body.GetMass() );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Bullet3_rocket, Bullet );



Bullet3_rocket.prototype.drawBullet = function()
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
        
    images: [ PRELOAD.getResult( 'bullet3_rocket' ) ]
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