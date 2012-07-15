/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";

function Weapon4_mines( shipObject )
{
    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 0;
}


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon4_mines, Bullets );



Weapon4_mines.prototype.drawBullet = function()
{
var minesSprite = {

    animations: {
    
        main: {
            
            frames: [ 0, 1, 2, 3 ],
            next: "main",
            frequency: 10
        
            }
        },
        
    frames: {
    
        width: 15,
        height: 15
    
        },
        
    images: [ "images/weapon4_mines.png" ]

    };
    

var sprite = new SpriteSheet( minesSprite );

var mine = new BitmapAnimation( sprite );

mine.gotoAndPlay( "main" );

var shipObject = this.shipObject;

mine.x = shipObject.x;
mine.y = shipObject.y;
//mine.rotation = shipObject.rotation; //HERE nao precisa

this.shape = mine;
};