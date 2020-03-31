import EnemyShip from "./enemy_ship.js";
import { PRELOAD, b2FixtureDef, CATEGORY, MASK, b2BodyDef, b2Body, b2PolygonShape, SCALE, WORLD, b2Vec2 } from "./main.js";

/*
    args = {
        x: Number,
        y: Number,
        damage: Number,     (optional)
        velocity: Number    (optional)
    }
 */
export default class EnemyMoveHorizontally extends EnemyShip {

constructor( args )
{
    super(args.x, args.y);

if ( typeof args.damage == 'undefined' )
    {
    args.damage = 10;
    }

if ( typeof args.velocity == 'undefined' )
    {
    args.velocity = 1;
    }

this.shape = null;

this.damage = args.damage;
this.velocity = args.velocity;

this.width = 20;
this.height = 20;

}


makeShape()
{
var speed = 0.2;

var spriteSheet = {

    animations: {

        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            speed: speed
            },

        main: {

            frames: [ 3, 4 ],
            next: "main",
            speed: speed
            }

        },

    frames: {

        width: this.width,
        height: this.height
        },

    images: [ PRELOAD.getResult( 'enemy_move_horizontally' ) ]
    };

var ss = new createjs.SpriteSheet( spriteSheet );

var enemy = new createjs.Sprite( ss );


    // origin in the middle of the image
enemy.regX = this.width / 2;
enemy.regY = this.height / 2;

enemy.gotoAndPlay("spawn");

this.shape = enemy;
};



setupPhysics()
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



afterSpawn()
{
this.body.SetLinearVelocity( new b2Vec2( this.velocity, 0 ) );
};


}