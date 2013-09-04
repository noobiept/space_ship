"use strict";


function EnemyRotateAround( x, y )
{
this.shape = null;

this.damage = EnemyRotateAround.damage;
this.velocity = EnemyRotateAround.velocity;

this.width = 20;
this.height = 20;

    // inherits from the Enemy class
EnemyShip.call( this, x, y );


this.ticksUntilNextBullet = 50;

this.countTicks = 0;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyRotateAround, EnemyShip);


EnemyRotateAround.damage_default = 10;
EnemyRotateAround.velocity_default = 1;

EnemyRotateAround.damage = EnemyRotateAround.damage_default;
EnemyRotateAround.velocity = EnemyRotateAround.velocity_default;




EnemyRotateAround.prototype.makeShape = function()
{
var spriteSheet = {

    animations: {
        
        spawn: {
            frames: [0, 1, 2],
            next: "spawn",
            frequency: 10
            },

        main: {   
            frames: [3, 4],
            next: "main",    // set up looping
            frequency: 10
            }
        },
        
    frames: {
        
        width: this.width,
        height: this.height
        },
        
    images: [ PRELOAD.getResult( 'enemy_rotate_around' ) ]

    };
    
var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.BitmapAnimation( ss );

    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};



EnemyRotateAround.prototype.setupPhysics = function()
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


EnemyRotateAround.prototype.enemyBehaviour = function()
{
var currentX = this.shape.x;
var currentY = this.shape.y;

    // make a triangle from the position the ship is in, relative to the enemy position
var triangleOppositeSide = MAIN_SHIP.shape.y - currentY;
var triangleAdjacentSide = currentX - MAIN_SHIP.shape.x;



    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );

var x = currentX + Math.sin( angleRadians ) * this.velocity;
var y = currentY + Math.cos( angleRadians ) * this.velocity;

this.moveTo( x, y );
};



EnemyRotateAround.increaseDifficulty = function()
{
EnemyRotateAround.damage++;
EnemyRotateAround.velocity++;
};


EnemyRotateAround.reset = function()
{
EnemyRotateAround.damage = EnemyRotateAround.damage_default;
EnemyRotateAround.velocity = EnemyRotateAround.velocity_default;
};




/*
    Gets called in the base class .tick() function
    
    Shoots the bullets
 */

EnemyRotateAround.prototype.tick_function = function()
{
this.countTicks++;

    // fire a new bullet
if (this.countTicks >= this.ticksUntilNextBullet)
    {
    this.countTicks = 0;
    
    var angleRotation = calculateAngleBetweenObjects( this, MAIN_SHIP );

        // we multiply by -1 because the .rotation property seems to have the angles in the other direction
    angleRotation *= -1;

    new Bullet1_laser( this, 'red', angleRotation );
    }
};
