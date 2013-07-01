"use strict";

function Weapon1_laser( shipObject, angleRotation )
{
this.width = 4;
this.height = 2;


    // inherit from the Weapons class
Weapons.call( this, shipObject, angleRotation );

this.damage = 10;
this.speed = 12;

applyImpulse( this.body, this.angleRotation, this.speed * this.body.GetMass() );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon1_laser, Weapons );


Weapon1_laser.prototype.drawBullet = function( angleRotation )
{
var laserSprite = {
    
    animations: {
    
        main :  { 
            frames: [ 0, 1 ],
            next : "main",
            frequency: 10
            }
        },
        
    frames: {
        width: 4,
        height: 2
        },
        
    images: [ "images/weapon1_laser.png" ]
    
    };

var sprite = new createjs.SpriteSheet( laserSprite );

var laser = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
laser.regY = this.height / 2;

laser.gotoAndPlay( "main" );
    

laser.rotation = angleRotation;

this.shape = laser;
};
