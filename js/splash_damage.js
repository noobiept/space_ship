(function(window)
{
/*
    The splash damage starts with half of the maximum radius, and expands until it reaches the maximum value, then back again until half, before being removed
 */

function SplashDamage( shipObject, x, y, maxRadius, color, splashDuration )
{
this.maxRadius = maxRadius;

    // duration (in number of ticks) of the splash damage (for that time, any ship that goes into that area takes damage. after that, the splash is removed)
this.splashDuration = splashDuration;


   // how many ticks it takes until we grow/shrink the radius per one
this.changeRadiusTick = parseInt( this.splashDuration / this.maxRadius, 10 );

    // start with half of the maximum radius
this.radius = maxRadius / 2;

this.width = this.radius * 2;
this.height = this.radius * 2;

this.color = color;
this.damage = 5;
this.type = TYPE_BULLET;
this.countTick = 0;


    // inherit from the Bullet class
Bullet.call( this, shipObject, 0, x, y );
}


    // inherit the member functions
INHERIT_PROTOTYPE( SplashDamage, Bullet );



SplashDamage.prototype.drawBullet = function()
{
var radius = this.radius;

var shape = new createjs.Shape();

var g = shape.graphics;

g.beginFill( this.color );
g.drawCircle( 0, 0, radius );

this.shape = shape;
};


SplashDamage.prototype.setupPhysics = function()
{
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.filter.categoryBits = this.shipObject.category_bits;
fixDef.filter.maskBits = this.shipObject.mask_bits;

fixDef.isSensor = true;

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2CircleShape( this.radius / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetUserData( this );

this.body = body;
this.fixDef = fixDef;
};


SplashDamage.prototype.setRadius = function( radius )
{
//this.fixDef.shape.SetRadius( radius / SCALE );
this.fixDef.shape = new b2CircleShape( radius /SCALE );

this.body.CreateFixture( this.fixDef );

var g = this.shape.graphics;

g.clear();
g.beginFill( this.color );
g.drawCircle( 0, 0, radius );

this.radius = radius;
};



SplashDamage.prototype.collisionResponse = function()
{
    // the element will be removed in other place, keep it for now
};




SplashDamage.prototype.tick_function = function()
{
this.countTick++;

var isGrowing = true;

if ( (this.countTick % this.changeRadiusTick) == 0 )
    {
    if ( this.countTick >= this.splashDuration / 2 )
        {
        isGrowing = false;
        }

    if ( isGrowing )
        {
        this.setRadius( this.radius + 1 );
        }

    else
        {
        this.setRadius( this.radius - 1 );
        }
    }


if ( this.countTick >= this.splashDuration )
    {
    this.remove();
    }
};



window.SplashDamage = SplashDamage;

}(window));