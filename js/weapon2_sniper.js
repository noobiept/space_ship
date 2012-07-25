/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon2_sniper( shipObject )
{
this.width = 6;
this.height = 2;

    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 0; //HERE ser instantaneo?...

Weapon2_sniper.findIfIntercept( shipObject );
} 


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon2_sniper, Bullets );


Weapon2_sniper.prototype.drawBullet = function()
{
var sniperSprite = {
    
    animations: {
    
        main :  { 
            frames: [ 0 ],
            next : "main"//,
            //frequency: 10
            }
        },
        
    frames: {
        width: 6,
        height: 2
        },
        
    images: [ "images/weapon2_sniper.png" ]
    };

var sprite = new SpriteSheet( sniperSprite );

var sniper = new BitmapAnimation( sprite );

    // origin in the middle of the image
sniper.regX = this.width / 2;
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
        console.log("sniper hit");
        enemies[i].remove();
        
        i--;
        }
    }
};