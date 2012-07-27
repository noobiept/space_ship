/*global Bullets, INHERIT_PROTOTYPE, $, SpriteSheet, BitmapAnimation*/
/*jslint vars:true, white: true*/

"use strict";

function Weapon1_laser( shipObject, angleRotation )
{
this.width = 4;
this.height = 2;

    // inherit from the Bullets class
Bullets.call( this, shipObject, angleRotation );

this.speed = 8; //HERE pode dar problemas se houver inimigos + pequenos que o speed (pq o speed eh o step... ter k verificar antes do salto)
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon1_laser, Bullets );


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

var sprite = new SpriteSheet( laserSprite );

var laser = new BitmapAnimation( sprite );

    // origin in the middle of the image
laser.regY = this.height / 2;


laser.gotoAndPlay( "main" );
    
    
var shipObject = this.shipObject;


laser.x = shipObject.x;
laser.y = shipObject.y;

if ( $.isNumeric( angleRotation ) )
    {
    laser.rotation = angleRotation;
    }

else
    {
    laser.rotation = shipObject.rotation;
    }


this.shape = laser;
};