/*global EnemyShip, INHERIT_PROTOTYPE, PRELOAD, createjs, b2FixtureDef, CATEGORY, MASK, b2BodyDef, b2Body, calculateAngleBetweenObjects, b2CircleShape, WORLD, SCALE, toRadians, b2Vec2, MAIN_SHIP*/
"use strict";

/*
    args = {
        x: Number,
        y: Number,
        damage: Number,     (optional)
        velocity: Number    (optional)
    }
 */

function EnemyKamikaze( args )
{
if ( typeof args.damage == 'undefined' )
    {
    args.damage = 10;
    }

if ( typeof args.velocity == 'undefined' )
    {
    args.velocity = 2;
    }


this.shape = null;

this.damage = args.damage;
this.velocity = args.velocity;

this.width = 14;
this.height = 14;

    // inherits from the Enemy class
EnemyShip.call( this, args.x, args.y );
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyKamikaze, EnemyShip );



EnemyKamikaze.prototype.makeShape = function()
{
var width = this.width;
var height = this.height;
var speed = 0.2;

var spriteSheet = {
    animations: {

        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            speed: speed
            },
        main: {
            frames: [ 3 ],
            next: "main",
            speed: speed
            }
        },
    frames: {
        width: width,
        height: height
        },
    images: [ PRELOAD.getResult( 'enemy_kamikaze' ) ]
    };

var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.Sprite( ss );

    // origin in the middle of the image
enemy.regX = width / 2;
enemy.regY = height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};


EnemyKamikaze.prototype.setupPhysics = function()
{
var width = this.width;

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

fixDef.shape = new b2CircleShape( width / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );

body.SetUserData( this );

this.body = body;
this.fixDef = fixDef;
};


EnemyKamikaze.prototype.enemyBehaviour = function()
{
var angle = calculateAngleBetweenObjects( this, MAIN_SHIP );

    // we multiply by -1 because the .rotation property seems to have the angles in the other direction (not quite sure..)
angle *= -1;

var radians = toRadians( angle );

var velocity = this.velocity;

var x = Math.cos( radians ) * velocity;
var y = Math.sin( radians ) * velocity;

this.body.SetLinearVelocity( new b2Vec2(x, y) );

this.updateRotation();
};



EnemyKamikaze.prototype.beforeAddToStage = function()
{
this.updateRotation();
};



/*
    Updates the rotation property so that the enemy ship points at the main ship
 */

EnemyKamikaze.prototype.updateRotation = function()
{
    // calculate the angle between the enemy and the ship
var angleDegrees = calculateAngleBetweenObjects( this, MAIN_SHIP );

    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
this.rotate( -1 * angleDegrees );
};




EnemyKamikaze.prototype.spawnTick_function = function()
{
this.updateRotation();
};
