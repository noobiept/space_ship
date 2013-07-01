"use strict";

(function(window)
{
    // remove the mines after some time
var REMOVE_TICK = 200;

function Weapon4_mines( shipObject )
{
this.width = 15;
this.height = 15;

    // inherit from the Weapons class
Weapons.call( this, shipObject );

this.speed = 0;
this.damage = 50;


    // count the ticks, and when it reaches 0 remove the mine
this.countTick = REMOVE_TICK;
}


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon4_mines, Weapons );



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
    

var sprite = new createjs.SpriteSheet( minesSprite );

var mine = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
mine.regX = this.height / 2;
mine.regY = this.height / 2;

mine.gotoAndPlay( "main" );

var shipObject = this.shipObject;

mine.x = shipObject.getX();
mine.y = shipObject.getY();
//mine.rotation = shipObject.getRotation(); //HERE nao precisa

this.shape = mine;
};




Weapon4_mines.prototype.tick_function = function()
{
this.countTick--;

    // remove the mine after some time (so that it doesn't stay there forever
if ( this.countTick < 0 )
    {
    this.remove();
    }
};


window.Weapon4_mines = Weapon4_mines;

}(window));