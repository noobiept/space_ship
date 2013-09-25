"use strict";

/*
    args = {
        x: Number,
        y: Number,
        scale: Number,      (optional)
        damage: Number,     (optional)
        velocity: Number    (optional)
    }

        - scale: scale the original image (1 -> 100%, no scaling)
 */

function EnemyRocks( args )
{
if (typeof args.scale != "undefined" && $.isNumeric( args.scale ))
    {
    this.scale = args.scale;
    }

else
    {
    this.scale = 1;
    }

if ( typeof args.damage == 'undefined' )
    {
    args.damage = 5;
    }

if ( typeof args.velocity == 'undefined' )
    {
    args.velocity = 1;
    }

this.shape = null;

this.damage = args.damage;
this.velocity = args.velocity;

this.width = 50;
this.height = 50;


    // inherits from the EnemyShip class
EnemyShip.call( this, args.x, args.y );
}


    // inherit the member functions
INHERIT_PROTOTYPE( EnemyRocks, EnemyShip );



EnemyRocks.prototype.makeShape = function()
{
var spriteConfig = {
    animations: {
        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: 10
            },
        main: {
            frames: [ 3 ],
            next: "main",
            frequency: 10
            }
        },
    frames: {
        width: this.width,
        height: this.height
        },
    images: [ PRELOAD.getResult( 'enemy_rocks' ) ]
    };

var sprite = new createjs.SpriteSheet( spriteConfig );
    
var rock = new createjs.BitmapAnimation( sprite );

    // origin in the middle of the image
rock.regX = this.width / 2;
rock.regY = this.height / 2;

rock.scaleX = this.scale;
rock.scaleY = this.scale;

    // don't update these variables before the scaling (they're are used in the config above, and the scaling is applied later)
this.width *= this.scale;
this.height *= this.scale;

    // it moves 
this.angleRadians = getRandomFloat( 0, 2 * Math.PI );

rock.gotoAndPlay("spawn");

this.shape = rock;
};


EnemyRocks.prototype.setupPhysics = function()
{
var width = this.width;
var height = this.height;

    // physics
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.filter.categoryBits = CATEGORY.enemy_spawning;
fixDef.filter.maskBits = MASK.enemy_spawning;

this.category_bits = CATEGORY.enemy_spawning;
this.mask_bits = MASK.enemy_spawning;


var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2PolygonShape;

    // arguments: half width, half height
fixDef.shape.SetAsBox( width / 2 / SCALE, height / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );


body.SetUserData( this );

this.body = body;
this.fixDef = fixDef;
};



EnemyRocks.prototype.enemyBehaviour = function()
{
var x = Math.sin( this.angleRadians ) * this.velocity;
var y = Math.cos( this.angleRadians ) * this.velocity;

this.body.SetLinearVelocity( new b2Vec2( x, y ) );

this.rotate( this.shape.rotation + 1 );
};


/*
    When it takes damage, create new smaller rocks
 */

EnemyRocks.prototype.tookDamage = function()
{
if (this.width >= 50)
    {
    var i;
    
    for (i = 0 ; i < 3 ; i++)
        {
            // spawn from the current position
        new EnemyRocks(
            {
                x: this.shape.x,
                y: this.shape.y,
                scale: 0.5,
                damage: this.damage,
                velocity: this.velocity
            });
        }
    }

this.remove();
};



