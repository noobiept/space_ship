"use strict";


function EnemyKamikaze( x, y )
{
this.shape = null;

this.damage = EnemyKamikaze.damage;
this.velocity = EnemyKamikaze.velocity;

this.width = 14;
this.height = 14;

    // inherits from the Enemy class
EnemyShip.call( this, x, y );
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyKamikaze, EnemyShip );


EnemyKamikaze.damage_default = 10;
EnemyKamikaze.velocity_default = 2;

EnemyKamikaze.damage = EnemyKamikaze.damage_default;
EnemyKamikaze.velocity = EnemyKamikaze.velocity_default;



EnemyKamikaze.prototype.makeShape = function()
{
var spriteSheet = {
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
    images: [ PRELOAD.getResult( 'enemy_kamikaze' ) ]
    };

var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.BitmapAnimation( ss );

    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};


EnemyKamikaze.prototype.setupPhysics = function()
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

fixDef.shape = new b2CircleShape( width / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );

body.SetUserData( this );

this.body = body;
this.fixDef = fixDef;
};


EnemyKamikaze.prototype.shipBehaviour = function()
{
var angle = calculateAngleBetweenObjects( this, MAIN_SHIP );

angle *= -1;    //HERE

var radians = toRadians( angle );

var velocity = EnemyKamikaze.velocity;

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
var angleDegrees = calculateAngleBetweenObjects( MAIN_SHIP, this );


    //HERE align the image
angleDegrees += 90;

    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
this.rotate( -1 * angleDegrees );
};



EnemyKamikaze.increaseDifficulty = function()
{
EnemyKamikaze.damage++;
EnemyKamikaze.velocity++;
};


EnemyKamikaze.reset = function()
{
EnemyKamikaze.damage = EnemyKamikaze.damage_default;
EnemyKamikaze.velocity = EnemyKamikaze.velocity_default;
};


EnemyKamikaze.prototype.spawnTick_function = function()
{
this.updateRotation();
};
