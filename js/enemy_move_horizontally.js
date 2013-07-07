"use strict";


function EnemyMoveHorizontally()
{
this.shape = null;

this.damage = EnemyMoveHorizontally.damage;
this.velocity = EnemyMoveHorizontally.velocity;

this.width = 20;
this.height = 20;

    // inhirit from EnemyShip class
EnemyShip.call( this );
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyMoveHorizontally, EnemyShip);


EnemyMoveHorizontally.damage_default = 10;
EnemyMoveHorizontally.velocity_default = 1;

EnemyMoveHorizontally.damage = EnemyMoveHorizontally.damage_default;
EnemyMoveHorizontally.velocity = EnemyMoveHorizontally.velocity_default;




EnemyMoveHorizontally.prototype.makeShape = function()
{
var frequency = 10;

var spriteSheet = {

    animations: {

        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: frequency
            },

        main: {

            frames: [ 3, 4 ],
            next: "main",
            frequency: frequency
            }

        },

    frames: {

        width: this.width,
        height: this.height
        },

    images: [ "images/enemy_move_horizontally.png" ]
    };

var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.BitmapAnimation( ss );


    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};



EnemyMoveHorizontally.prototype.setupPhysics = function()
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





EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
var nextX = this.shape.x + this.velocity;
var nextY = this.shape.y;

this.moveTo( nextX, nextY );
};


EnemyMoveHorizontally.increaseDifficulty = function()
{
EnemyMoveHorizontally.damage++;
EnemyMoveHorizontally.velocity++;
};


EnemyMoveHorizontally.reset = function()
{
EnemyMoveHorizontally.damage = EnemyMoveHorizontally.damage_default;
EnemyMoveHorizontally.velocity = EnemyMoveHorizontally.velocity_default;
};