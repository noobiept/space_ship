"use strict";

function Bullet1_laser( shipObject, angleRotation )
{
this.width = 4;
this.height = 2;


    // inherit from the Bullet class
Bullet.call( this, shipObject, angleRotation );

this.damage = 10;
this.speed = 12;

applyImpulse( this.body, this.angleRotation, this.speed * this.body.GetMass() );
}



    // inherit the member functions
INHERIT_PROTOTYPE( Bullet1_laser, Bullet );


Bullet1_laser.prototype.drawBullet = function( angleRotation )
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
        
    images: [ PRELOAD.getResult( 'bullet1_laser' ) ]
    
    };

var sprite = new createjs.SpriteSheet( laserSprite );

var laser = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
laser.regY = this.height / 2;

laser.gotoAndPlay( "main" );
    

laser.rotation = angleRotation;

this.shape = laser;
};
