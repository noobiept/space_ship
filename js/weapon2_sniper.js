/*global Bullets, INHERIT_PROTOTYPE, SpriteSheet, BitmapAnimation, STAGE, EnemyShip*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon2_sniper( shipObject )
{
this.width = 1000;
this.height = 2;

    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 0; //HERE ser instantaneo?...

this.countTicks = Weapon2_sniper.numberTicksAnimation;

Weapon2_sniper.findIfIntercept( shipObject );
} 

    // number of ticks of the duration of the bullet animation, before removing it from the stage
Weapon2_sniper.numberTicksAnimation = 30;


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon2_sniper, Bullets );


Weapon2_sniper.prototype.drawBullet = function()
{
var sniperSprite = {
    
    animations: {
    
        main :  { 
            frames: [ 0 ],
            next : "main",
            frequency: 10
            }
        },
        
    frames: {
        width: 1000,
        height: 2
        },
        
    images: [ "images/weapon2_sniper.png" ]
    };

var sprite = new SpriteSheet( sniperSprite );

var sniper = new BitmapAnimation( sprite );

    // origin in the middle of the image
sniper.regY = this.height / 2;

sniper.gotoAndPlay( "main" );
    
    
var shipObject = this.shipObject;

sniper.x = shipObject.x;
sniper.y = shipObject.y;
sniper.rotation = shipObject.rotation;


this.shape = sniper;
};




Weapon2_sniper.findIfIntercept = function(ship)
{

var mouseX = STAGE.mouseX;
var mouseY = STAGE.mouseY;

var shipX = ship.x;
var shipY = ship.y;

    // find the line equation: y = slope * x + b
var slope = (mouseY - shipY) / (mouseX - shipX);

var b = mouseY - slope * mouseX;

var enemies = EnemyShip.all;

var i;
var enemyX, enemyY;

for (i = 0 ; i < enemies.length ; i++)
    {
    enemyX = enemies[i].x;
    enemyY = enemies[i].y;
    
        // see if any enemy is on the path of the bullet
    
    //console.log(enemyY, slope * enemyX + b);
    
    var aa = slope * enemyX + b;
    
    
    
        //HERE tem k abranger uma area..
    if ( enemyY >= aa - 20 && enemyY <= aa + 20)
        {
        enemies[i].remove();
        
        i--;
        }
    }
};


Weapon2_sniper.prototype.tick_function = function()
{
this.countTicks--;

if (this.countTicks <= 0)
    {
    this.remove();
    }
};