import EnemyShip, { EnemyShipArgs } from "./enemy_ship.js";
import { PRELOAD, b2FixtureDef, CATEGORY, MASK, b2BodyDef, b2Body, b2PolygonShape, SCALE, WORLD, b2Vec2 } from "./main.js";
import { getRandomFloat } from "./utilities.js";


export type EnemyRocksArgs = {
    scale?: number
} & EnemyShipArgs

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
export default class EnemyRocks extends EnemyShip<EnemyRocksArgs> {

scale: number;
angleRadians: number;

constructor( args )
{
    const scale = args.scale ?? 1;

    super({
        ...args,
        width: 50,
        height: 50,
        scale
    })

    this.scale = scale;
    this.damage = args.damage ?? 5;
    this.velocity = args.velocity ?? 1;
}


makeShape({ width, height, scale }: EnemyRocksArgs)
{
var speed = 0.2;

var spriteConfig = {
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
        width,
        height
        },
    images: [ PRELOAD.getResult( 'enemy_rocks' ) ]
    };

var sprite = new createjs.SpriteSheet( spriteConfig );
var rock = new createjs.Sprite( sprite );

    // origin in the middle of the image
rock.regX = width / 2;
rock.regY = height / 2;

rock.scaleX = scale;
rock.scaleY = scale;

    // don't update these variables before the scaling (they're are used in the config above, and the scaling is applied later)
this.width *= scale;
this.height *= scale;

    // it moves
this.angleRadians = getRandomFloat( 0, 2 * Math.PI );

rock.gotoAndPlay("spawn");

return rock;
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

const bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.position.x = 0;
bodyDef.position.y = 0;

const shape = new b2PolygonShape;

// arguments: half width, half height
shape.SetAsBox( width / 2 / SCALE, height / 2 / SCALE );
fixDef.shape = shape

const body = WORLD.CreateBody( bodyDef );
body.CreateFixture( fixDef );
body.SetUserData( this );

this.body = body;
this.fixDef = fixDef;
};



enemyBehaviour()
{
var x = Math.sin( this.angleRadians ) * this.velocity;
var y = Math.cos( this.angleRadians ) * this.velocity;

this.body.SetLinearVelocity( new b2Vec2( x, y ) );

this.rotate( this.shape.rotation + 1 );
};


/*
    When it takes damage, create new smaller rocks
 */
tookDamage()
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
}