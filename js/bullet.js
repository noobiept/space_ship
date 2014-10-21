"use strict";

(function(window)
{

/*
    Use as base class for all the bullet types
    
    Functions to write (in derived class):
    
        .drawBullet()
        .setupPhysics()         (optional -- the default is a rectangle from the width/height properties)
        .tick_function()        (optional)


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
this.type = TYPE_BULLET;
this.damage = 10;

    // draw the bullet
this.drawBullet( angleRotation );

this.setupPhysics();


STAGE.addChild( this.shape );

ZIndex.update();

Bullet.all_bullets.push( this );


if ( typeof x === 'undefined')
    {
    x = shipObject.getX();
    y = shipObject.getY();
    }

    // fire from outside the main ship radius (so it doesn't collide immediately with it)
var shipRadius = MAIN_SHIP.width / 2;


var radians = toRadians( angleRotation );

var addX = Math.cos( radians ) * shipRadius;
var addY = Math.sin( radians ) * shipRadius;

this.rotate( angleRotation );
this.moveTo( x + addX, y + addY );
}

    // all the bullets (from the enemies or the main ship)
Bullet.all_bullets = [];



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

    // so that it doesn't have a reaction when it collides (but we still need to detect the collision)
    // useful for example for the sniper, to be able to continue moving through
fixDef.isSensor = true;


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
this.fixDef = fixDef;
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
    How much damage the bullets gives to the ship when it hits
 */

Bullet.prototype.damageGiven = function()
{
return this.damage;
};


/*
    What to do to the bullet when a collision is detected
 */

Bullet.prototype.collisionResponse = function()
{
    // default is to remove the bullet, but you can override this function to do something else
this.remove();
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
var all = Bullet.all_bullets;

STAGE.removeChild( this.shape );
WORLD.DestroyBody( this.body );

var position = all.indexOf( this );

all.splice( position, 1 );
};


/*
    Remove all bullets 
 */

Bullet.removeAllBullets = function()
{
$( Bullet.all_bullets ).each(function(index, enemy)
    {
    enemy.remove();
    });
};



Bullet.prototype.tick = function( event )
{
if ( event.paused )
    {
    return;
    }

this.updateShape();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }

var i;
var bulletObject;

    // check if the bullets are out of bounds (outside the canvas), and remove them if so
for (i = 0 ; i < Bullet.all_bullets.length ; i++)
    {
    bulletObject = Bullet.all_bullets[ i ];

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
