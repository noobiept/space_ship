import { TYPE_ENEMY, STAGE, SCALE, b2Vec2, WORLD, GAME_WIDTH, GAME_HEIGHT, CATEGORY, MASK } from "./main";
import * as ZIndex from './z_index'
import * as GameStatistics from './game_statistics'

/*
    Don't use directly, use as a base class, and write these functions:

    --- to the prototype ---

        .makeShape()
        .setupPhysics()
        .enemyBehaviour()
        .updateShape()          (optional)
        .tookDamage()           (optional)
        .beforeAddToStage()     (optional)
        .spawnTick_function()   (optional)
        .tick_function()        (optional)


    and change these properties:

        .damage
        .velocity
        .width
        .height
        .category_bits
        .mask_bits

    Add reference of the drawn element to:

        .shape

    Physics body

        .body
        .fixDef

 */


export default abstract class EnemyShip {

    static all = [];
    static all_spawning = [];

    type;
    spawnTicks_int: number;
    shape;
    body;
    fixDef;
    category_bits;
    mask_bits;

constructor( x, y )
{
this.type = TYPE_ENEMY;

    // the number of ticks it takes until the enemy can start moving/firing/being killed
this.spawnTicks_int = 20;


    // make the tick function deal with spawning the enemy
this.tick = this.spawningTick;
EnemyShip.all_spawning.push( this );


    // draw the shape (spawn phase animation first)
this.makeShape();

this.setupPhysics();

this.beforeAddToStage();

    // add to Container()
STAGE.addChild( this.shape );

ZIndex.update();
GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() + 1 );

this.moveTo( x, y );
}


abstract makeShape();
abstract setupPhysics();
abstract enemyBehaviour();


/*
    Gets called once after the spawn phase ended, and is going to the normal phase
 */
abstract afterSpawn();


/*
    Its called right before the enemy is added to the Stage
 */
abstract beforeAddToStage();


/*
    Updates the shape position to match the physic body
 */
updateShape()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


getPosition()
{
return {
    x: this.shape.x,
    y: this.shape.y
    };
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



rotate( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};



damageGiven()
{
return this.damage;
};

tookDamage()
{
    // do this

    // just remove it (override this for something different)
this.remove();
};



checkLimits()
{
var x = this.getX();
var y = this.getY();

if (x < 0)
    {
    this.moveTo( GAME_WIDTH, y );
    }

else if (x > GAME_WIDTH)
    {
    this.moveTo( 0, y );
    }

else if (y < 0)
    {
    this.moveTo( x, GAME_HEIGHT );
    }

else if (y > GAME_HEIGHT)
    {
    this.moveTo( x, 0 );
    }
};


/*
    Remove the enemy ship, and update the game statistics
 */
remove()
{
STAGE.removeChild( this.shape );
WORLD.DestroyBody( this.body );

var position = EnemyShip.all.indexOf( this );

EnemyShip.all.splice( position, 1 );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
};



/*
    Remove everything
 */
static removeAll()
{
$( EnemyShip.all ).each(function(index, ship)
    {
    ship.remove( index );
    });

$( EnemyShip.all_spawning ).each(function( index, ship )
    {
    STAGE.removeChild( ship.shape );
    WORLD.DestroyBody( ship.body );

    var position = EnemyShip.all_spawning.indexOf( ship );

    EnemyShip.all_spawning.splice( position, 1 );
    });
};



/*
    The idea here is to have a time when the enemy ship can't do damage (or receive), since its still spawning.
    This prevents problems like a ship spawning right under the main ship (and so taking damage without any chance to prevent it)
 */
spawningTick( event )
{
if ( event.paused )
    {
    return;
    }

this.spawnTicks_int--;


if (this.spawnTicks_int < 0)
    {
        // play the main animation
    this.shape.gotoAndPlay("main");

        // only add now to the enemies list (so, only from now on will the bullets be able to kill it, etc)
    EnemyShip.all.push( this );

            // remove from the spawn array
    var spawnIndex = EnemyShip.all_spawning.indexOf( this );
    EnemyShip.all_spawning.splice( spawnIndex, 1 );

    var fixDef = this.fixDef;

    fixDef.filter.categoryBits = CATEGORY.enemy;
    fixDef.filter.maskBits = MASK.enemy;

    this.category_bits = CATEGORY.enemy;
    this.mask_bits = MASK.enemy;

    this.body.CreateFixture( fixDef );

    this.afterSpawn();

        // now execute the normal tick function
    this.tick = this.normalTick;
    }

if (typeof this.spawnTick_function !== "undefined" && this.spawnTick_function !== null)
    {
    this.spawnTick_function();
    }
};


normalTick( event )
{
if ( event.paused )
    {
    return;
    }

this.enemyBehaviour();

this.updateShape();

    // the limits of the canvas
this.checkLimits();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};


tick()
{
    // this will point to spawningTick() or normalTick()
};
}