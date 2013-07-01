"use strict";


function Weapon2_sniper( shipObject )
{
this.width = 10;
this.height = 2;

    // inherit from the Weapons class
Weapons.call( this, shipObject );

//this.countTicks = Weapon2_sniper.numberTicksAnimation;

this.damage = 40;

this.speed = 40;

applyImpulse( this.body, shipObject.getRotation(), this.speed * this.body.GetMass() );
}

    // number of ticks of the duration of the bullet animation, before removing it from the stage
Weapon2_sniper.numberTicksAnimation = 30;


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon2_sniper, Weapons );


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
        width: 10,
        height: 2
        },
        
    images: [ "images/weapon2_sniper.png" ]
    };

var sprite = new createjs.SpriteSheet( sniperSprite );

var sniper = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
sniper.regY = this.height / 2;

sniper.gotoAndPlay( "main" );
    
    
var shipObject = this.shipObject;

sniper.rotation = shipObject.getRotation();


this.shape = sniper;
};




Weapon2_sniper.findIfIntercept = function(ship)
{

var mouseX = STAGE.mouseX;
var mouseY = STAGE.mouseY;

var shipX = ship.getX();
var shipY = ship.getY();

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
        enemies[i].tookDamage();
        
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
