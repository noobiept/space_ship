/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";

function Weapon1_laser( shipObject )
{
    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 8; //HERE pode dar problemas se houver inimigos + pequenos que o speed (pq o speed eh o step... ter k verificar antes do salto)
}



    // inherit the member functions
INHERIT_PROTOTYPE( Weapon1_laser, Bullets );


Weapon1_laser.prototype.drawBullet = function()
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

laser.gotoAndPlay( "main" );
    
    
var shipObject = this.shipObject;


laser.x = shipObject.x;
laser.y = shipObject.y;
laser.rotation = shipObject.rotation;


this.shape = laser;
};