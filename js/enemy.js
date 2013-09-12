"use strict";

/*
    This anonymous function, is to create a 'module', all functions/variables here are not available outside (apart from the ones we explicitly add to the window object)
 */

(function(window)
{

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

function EnemyShip( x, y )
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

createjs.Ticker.addListener( this );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() + 1 );

this.moveTo( x, y );
}


EnemyShip.all = [];

EnemyShip.all_spawning = [];






EnemyShip.prototype.makeShape = function()
{
    // do this
};



EnemyShip.prototype.setupPhysics = function()
{
    // do this
};


/*
    Updates the shape position to match the physic body
 */

EnemyShip.prototype.updateShape = function()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


EnemyShip.prototype.getPosition = function()
{
return {
    x: this.shape.x,
    y: this.shape.y
    };
};

EnemyShip.prototype.getX = function()
{
return this.shape.x;
};


EnemyShip.prototype.getY = function()
{
return this.shape.y;
};


EnemyShip.prototype.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};



EnemyShip.prototype.rotate = function( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};



EnemyShip.prototype.damageGiven = function()
{
return this.damage;
};


EnemyShip.prototype.tookDamage = function()
{
    // do this

    // just remove it (override this for something different)
this.remove();
};


EnemyShip.prototype.enemyBehaviour = function()
{
    // do this
};



/*
    Gets called once after the spawn phase ended, and is going to the normal phase
 */

EnemyShip.prototype.afterSpawn = function()
{
    // do this
};



/*
    Its called right before the enemy is added to the Stage
 */

EnemyShip.prototype.beforeAddToStage = function()
{
    // do this
};




EnemyShip.prototype.checkLimits = function()
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

EnemyShip.prototype.remove = function()
{
STAGE.removeChild( this.shape );

createjs.Ticker.removeListener( this );


WORLD.DestroyBody( this.body );

var position = EnemyShip.all.indexOf( this );

EnemyShip.all.splice( position, 1 );


GameStatistics.updateNumberOfEnemies( GameStatistics.getNumberOfEnemies() - 1 );

GameStatistics.updateScore( GameStatistics.getScore() + 1 );
};



/*
    Remove everything
 */

EnemyShip.removeAll = function()
{
$( EnemyShip.all ).each(function(index, ship)
    {
    ship.remove( index );
    });

$( EnemyShip.all_spawning ).each(function( index, ship )
    {
    STAGE.removeChild( ship.shape );

    createjs.Ticker.removeListener( ship );

    WORLD.DestroyBody( ship.body );

    var position = EnemyShip.all_spawning.indexOf( ship );

    EnemyShip.all_spawning.splice( position, 1 );
    });
};



/*
    The idea here is to have a time when the enemy ship can't do damage (or receive), since its still spawning.
    This prevents problems like a ship spawning right under the main ship (and so taking damage without any chance to prevent it)
 */

EnemyShip.prototype.spawningTick = function()
{
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


EnemyShip.prototype.normalTick = function()
{
this.enemyBehaviour();

this.updateShape();

    // the limits of the canvas
this.checkLimits();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};


EnemyShip.prototype.tick = function()
{
    // this will point to spawningTick() or normalTick()
};


window.EnemyShip = EnemyShip;

}(window));
