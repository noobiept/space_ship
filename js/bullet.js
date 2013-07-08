"use strict";

(function(window)
{

/*
    Use as base class for all the bullet types
    
    Functions to write (in derived class):
    
        .drawBullet()
        .setupPhysics()         (optional -- the default is a rectangle from the width/height properties)

    Properties:

        .width
        .height
        .damage
        .speed
        
    Add reference of the drawn element to:
    
        .shape
        
    Arguments:
    
        shipObject    : of the ship which fired the bullet
        angleRotation : of the bullet
 */

function Bullet( shipObject, angleRotation, x, y )
{
this.shape = null;

this.shipObject = shipObject;

if ( !$.isNumeric( angleRotation ) )
    {
    angleRotation = calculateAngleBetweenObjects2( MAIN_SHIP.getX(), MAIN_SHIP.getY(), STAGE.mouseX, STAGE.mouseY );
    }

angleRotation = -1 * angleRotation; //HERE

this.angleRotation = angleRotation;

this.type = TYPE_BULLET;

this.damage = 10;

    // draw the bullet
this.drawBullet( angleRotation );

this.setupPhysics();

this.isEnemy = shipObject.isEnemy;

STAGE.addChild( this.shape );

ZIndex.update();

createjs.Ticker.addListener( this );


if ( this.isEnemy )
    {
    Bullet.enemyBullets.push( this );
    }

else
    {
    Bullet.allyBullets.push( this );
    }



if ( typeof x === 'undefined')
    {
    x = shipObject.getX();
    y = shipObject.getY();
    }

    // fire from outside the main ship radius (so it doesn't collide immediately with it)
var shipRadius = MAIN_SHIP.width / 2;

var angle = this.angleRotation;

var radians = toRadians( angle );

var addX = Math.cos( radians ) * shipRadius;
var addY = Math.sin( radians ) * shipRadius;

this.rotate( angle );
this.moveTo( x + addX, y + addY );
}

    // all the bullets from the enemies
Bullet.enemyBullets = [];

    // all the bullets from the allies
Bullet.allyBullets = [];



Bullet.prototype.drawBullet = function( angleRotation )
{
    // do this
};



Bullet.prototype.setupPhysics = function()
{
var width = this.width;
var height = this.height;

    // physics
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.filter.categoryBits = this.shipObject.category_bits;
fixDef.filter.maskBits = this.shipObject.mask_bits;

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2PolygonShape;

    // arguments: half width, half height
fixDef.shape.SetAsBox( width / 2 / SCALE, height / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetBullet( true );

body.SetUserData( this );

this.body = body;
};




Bullet.prototype.getX = function()
{
return this.shape.x;
};


Bullet.prototype.getY = function()
{
return this.shape.y;
};


Bullet.prototype.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};


Bullet.prototype.updateShape = function()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


/*
    Tells if a bullet has reached the canvas limits
 */

Bullet.prototype.reachedLimits = function()
{
var x = this.shape.x;
var y = this.shape.y;

if (x < 0 || x > GAME_WIDTH || y < 0 || y > GAME_HEIGHT)
    {
    return true;
    }

return false;
};


/*
    How much damage the bullets gives to the ship when it hits
 */

Bullet.prototype.damageGiven = function()
{
return this.damage;
};



Bullet.prototype.rotate = function( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};

/*
    Remove the bullet from the stage
 */

Bullet.prototype.remove = function()
{
var all;

if ( this.isEnemy )
    {
    all = Bullet.enemyBullets;
    }
    
else
    {
    all = Bullet.allyBullets;
    }
    
STAGE.removeChild( this.shape );
createjs.Ticker.removeListener( this );


WORLD.DestroyBody( this.body );

var position = all.indexOf( this );

all.splice( position, 1 );
};


/*
    Remove all bullets 
 */

Bullet.removeAllBullets = function()
{
$( Bullet.enemyBullets ).each(function(index, enemy)
    {
    enemy.remove();
    });
    
$( Bullet.allyBullets ).each(function(index, ally)
    {
    ally.remove();
    });
};



Bullet.prototype.tick = function()
{
this.updateShape();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }

var i;
var bulletObject;

    // check if the bullets are out of bounds (outside the canvas), and remove them if so
for (i = 0 ; i < Bullet.allyBullets.length ; i++)
    {
    bulletObject = Bullet.allyBullets[ i ];

    if ( outOfBounds( bulletObject ) )
        {
        bulletObject.remove();

        i--;
        }
    }

for (i = 0 ; i < Bullet.enemyBullets.length ; i++)
    {
    bulletObject = Bullet.enemyBullets[ i ];

    if ( outOfBounds( bulletObject ) )
        {
        bulletObject.remove();

        i--;
        }
    }
};




    // public stuff
window.Bullet = Bullet;

}(window));
