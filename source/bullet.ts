import { STAGE, TYPE_BULLET, MAIN_SHIP, b2FixtureDef, b2BodyDef, b2Body, b2PolygonShape, b2Vec2, SCALE, WORLD  } from './main'
import * as ZIndex from './z_index'
import { toRadians, outOfBounds } from './utilities'

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

export default abstract class Bullet {

shape;
shipObject;
type;
body;
fixDef;
damage: number;
removed: boolean;
width: number;
height: number;


    // all the bullets (from the enemies or the main ship)
static all_bullets = [];

constructor( shipObject, angleRotation, x?: number, y?: number )
{
this.shape = null;
this.shipObject = shipObject;
this.type = TYPE_BULLET;
this.damage = 10;
this.removed = false;

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


abstract drawBullet( angleRotation );


setupPhysics()
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


getX()
{
return this.shape.x;
};


getY()
{
return this.shape.y;
};


moveTo( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};


updateShape()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};



/*
    How much damage the bullets gives to the ship when it hits
 */
damageGiven()
{
return this.damage;
};


/*
    What to do to the bullet when a collision is detected
 */
collisionResponse()
{
    // default is to remove the bullet, but you can override this function to do something else
this.remove();
};


rotate( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};


/*
    Remove the bullet from the stage
 */
remove()
{
this.removed = true;
};


removeNow()
{
var all = Bullet.all_bullets;

STAGE.removeChild( this.shape );
WORLD.DestroyBody( this.body );

var position = all.indexOf( this );

all.splice( position, 1 );
};



tick( event )
{
if ( event.paused || this.removed )
    {
    return;
    }

this.updateShape();

//HERE refactor this
if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};


/*
    Remove all bullets.
 */
static removeAllBullets()
{
for (var a = Bullet.all_bullets.length - 1 ; a >= 0 ; a--)
    {
    Bullet.all_bullets[ a ].removeNow();
    }

Bullet.all_bullets.length = 0;
};


/**
 * Removes all bullets that were marked to be removed, and all bullets that are out of bounds (outside of the canvas).
 */
static cleanAll()
{
for (let i = Bullet.all_bullets.length - 1 ; i >= 0 ; i--)
    {
    const bulletObject = Bullet.all_bullets[ i ];

    if ( bulletObject.removed || outOfBounds( bulletObject ) )
        {
        bulletObject.removeNow();
        }
    }
};
}