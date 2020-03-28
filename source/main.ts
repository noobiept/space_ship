import Box2D from 'box2dweb'
import * as Options from './options'
import Message from './message'

    // global variables

export var CANVAS;
var CANVAS_DEBUG;

var DEBUG = false;

var BASE_URL = '';

    // createjs

export var STAGE;
var PRELOAD;

    // box2d physics

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;

    // scale from meters/kilograms/seconds into pixels
var SCALE = 30;

var WORLD = null;


    // playable dimensions (the rest of the canvas is for menus/etc)
var GAME_WIDTH;
var GAME_HEIGHT;

export var MAIN_SHIP;

var ENEMY_TYPES = [

    EnemyMoveHorizontally,
    EnemyRotateAround,
    EnemyKamikaze,
    EnemyRocks
    ];


var GAME_MODE = null;
var GAME_OBJECT = null;

    // :: Collision Detection :: //

    // objects identification (for the collision detection)
var TYPE_SHIP = 0;
var TYPE_ENEMY = 1;
var TYPE_BULLET = 2;

    // has functions to be called later (related to a collision). Have to remove the elements after executing the function
var COLLISION_F = [];


    // categories
var CATEGORY = {
    ship: 1,          // 0001
    enemy: 2,           // 0010
    enemy_spawning: 4   // 0100
    };

var MASK = {
    ship: CATEGORY.enemy,   // ship can collide with enemies
    enemy: CATEGORY.ship,   // enemies can collide with the ship
    enemy_spawning: 0,      // doesn't collide with anything, during the spawn phase
    dontCollide: 0
    };


var LOADING_MESSAGE;

window.onload = function()
{
AppStorage.getData( [ 'space_ship_options' ], initApp );
};


function initApp( data )
{
Options.load( data[ 'space_ship_options' ] );

    // get a reference to the canvas we'll be working with
CANVAS = document.querySelector( "#mainCanvas" );

    // canvas for debugging the physics
CANVAS_DEBUG = document.querySelector( '#debugCanvas' );

    // create a stage object to work with the canvas. This is the top level node in the display list
STAGE = new createjs.Stage( CANVAS );

WORLD = new b2World(
    new b2Vec2(0, 0),   // zero-gravity
    true                // allow sleep
    );


createjs.Ticker.setInterval( 50 );

if ( DEBUG )
    {
    $( CANVAS_DEBUG ).css('display', 'block');
    centerCanvas( CANVAS_DEBUG );

        // setup debug draw
    var debugDraw = new b2DebugDraw();

    debugDraw.SetSprite( CANVAS_DEBUG.getContext('2d') );
    debugDraw.SetDrawScale( SCALE );
    debugDraw.SetFillAlpha(0.4);
    debugDraw.SetLineThickness(1);
    debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );

    WORLD.SetDebugDraw( debugDraw );
    }


PRELOAD = new createjs.LoadQueue();

var manifest = [
    { id: "level1",                  src: BASE_URL + "maps/level1.json" },
    { id: "level2",                  src: BASE_URL + "maps/level2.json" },
    { id: "level3",                  src: BASE_URL + "maps/level3.json" },
    { id: "level4",                  src: BASE_URL + "maps/level4.json" },
    { id: "level5",                  src: BASE_URL + "maps/level5.json" },
    { id: "level6",                  src: BASE_URL + "maps/level6.json" },
    { id: "level7",                  src: BASE_URL + "maps/level7.json" },
    { id: "level8",                  src: BASE_URL + "maps/level8.json" },
    { id: "level9",                  src: BASE_URL + "maps/level9.json" },
    { id: "level10",                 src: BASE_URL + "maps/level10.json" },

    { id: "scumm_bar",               src: BASE_URL + "sound/scumm_bar.ogg" },
    { id: "space_ship_1",            src: BASE_URL + "sound/space_ship_1.ogg" },
    { id: "dry_fire",                src: BASE_URL + "sound/dry_fire.ogg" },

    { id: 'enemy_move_horizontally', src: BASE_URL + 'images/enemy_move_horizontally.png' },
    { id: 'enemy_rocks',             src: BASE_URL + 'images/enemy_rocks.png' },
    { id: 'enemy_rotate_around',     src: BASE_URL + 'images/enemy_rotate_around.png' },
    { id: 'enemy_kamikaze',          src: BASE_URL + 'images/enemy_kamikaze.png' },
    { id: 'ship',                    src: BASE_URL + 'images/ship.png' }
    ];


LOADING_MESSAGE = new Message({ text: 'Loading', centerWindow: true });

PRELOAD.installPlugin( createjs.Sound );
PRELOAD.addEventListener( 'progress', updateLoading );
PRELOAD.addEventListener( 'complete', MainMenu.open );
PRELOAD.loadManifest( manifest, true );
}


function updateLoading( event )
{
LOADING_MESSAGE.setText( "Loading " + ( event.progress*100 | 0 ) + "%" );
}


function initGame()
{
resetStuff();

GameStatistics.start();


GAME_WIDTH = CANVAS.width;
GAME_HEIGHT = CANVAS.height;


MAIN_SHIP = new Ship();


    // so that .tick() of EnemyShip/Ship/... is called automatically
createjs.Ticker.on( 'tick', tick );


    // call update on the stage to make it render the current display list to the canvas
STAGE.update();


    // set up collision detection
var listener = new b2ContactListener;

listener.BeginContact = collisionDetection;

WORLD.SetContactListener( listener );


    //register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

new Music( 0 );

GameMenu();
}

/**
    @param {Boolean} [fromPreviousLevel=false] restarting the game, starting at same level it was before
 */

export function startGameMode( fromPreviousLevel )
{
if ( typeof fromPreviousLevel == 'undefined' )
    {
    fromPreviousLevel = false;
    }

var startingLevel = 0;

if ( GAME_OBJECT )
    {
    if ( fromPreviousLevel )
        {
        startingLevel = GAME_OBJECT.CURRENT_MAP;
        }
    }

resetStuff();

CANVAS.style.display = 'block';
GAME_OBJECT = new GAME_MODE( startingLevel );
}



export function pause()
{
if ( MAIN_SHIP )
    {
    MAIN_SHIP.clearEvents();
    }

createjs.Ticker.setPaused( true );
}


export function resume()
{
if ( MAIN_SHIP )
    {
    MAIN_SHIP.setEvents();
    }

createjs.Ticker.setPaused( false );
}


/*
    Called on 'BeginContact' between box2d bodies

    Warning: You cannot create/destroy Box2D entities inside these callbacks.
 */
function collisionDetection( contact )
{
var objectA = contact.GetFixtureA().GetBody().GetUserData();
var objectB = contact.GetFixtureB().GetBody().GetUserData();

var typeA = objectA.type;
var typeB = objectB.type;

var shipObject;
var enemyObject;
var bulletObject;

    // collision between the main ship and an enemy
if ( (typeA === TYPE_SHIP && typeB === TYPE_ENEMY) ||
     (typeB === TYPE_SHIP && typeA === TYPE_ENEMY) )
    {
        // determine which one is which
    if ( typeA === TYPE_SHIP )
        {
        shipObject = objectA;
        enemyObject = objectB;
        }

    else
        {
        shipObject = objectB;
        enemyObject = objectA;
        }

        // already was added to the collision array (don't add the same collision twice)
    if ( enemyObject.alreadyInCollision )
        {
        return;
        }

    enemyObject.alreadyInCollision = true;

        // make it not collidable anymore
    enemyObject.fixDef.mask_bits = MASK.dontCollide;
    enemyObject.body.CreateFixture( enemyObject.fixDef );

    COLLISION_F.push(
        function()
            {
            shipObject.tookDamage( enemyObject.damageGiven() );

            enemyObject.tookDamage();
            }
        );
    }

    // collision between the main ship and a bullet
else if ( (typeA === TYPE_SHIP && typeB === TYPE_BULLET) ||
          (typeB === TYPE_SHIP && typeA === TYPE_BULLET) )
    {
        // determine which one is which
    if ( typeA === TYPE_SHIP )
        {
        shipObject = objectA;
        bulletObject = objectB;
        }

    else
        {
        shipObject = objectB;
        bulletObject = objectA;
        }


        // already was added to the collision array (don't add the same collision twice)
    if ( bulletObject.alreadyInCollision )
        {
        return;
        }

    bulletObject.alreadyInCollision = true;

        // make it not collidable anymore
    bulletObject.fixDef.mask_bits = MASK.dontCollide;
    bulletObject.body.CreateFixture( bulletObject.fixDef );

    COLLISION_F.push(
        function()
            {
            bulletObject.collisionResponse();

                // remove the EnemyShip
            shipObject.tookDamage( bulletObject.damageGiven() );
            }
        );
    }

    // collision between a bullet and an enemy
else if ( (typeA === TYPE_BULLET && typeB === TYPE_ENEMY) ||
          (typeB === TYPE_BULLET && typeA === TYPE_ENEMY) )
    {
        // determine which one is which
    if ( typeA === TYPE_BULLET )
        {
        bulletObject = objectA;
        enemyObject = objectB;
        }

    else
        {
        bulletObject = objectB;
        enemyObject = objectA;
        }

        // already was added to the collision array (don't add the same collision twice)
    if ( enemyObject.alreadyInCollision )
        {
        return;
        }

    enemyObject.alreadyInCollision = true;

        // make it not collidable anymore
    enemyObject.fixDef.mask_bits = MASK.dontCollide;
    enemyObject.body.CreateFixture( enemyObject.fixDef );


    COLLISION_F.push(
        function()
            {
            bulletObject.collisionResponse();

                // remove the EnemyShip
            enemyObject.tookDamage( bulletObject.damageGiven() );
            }
        );
    }
}


/*
    center the canvas in the middle of window
 */

function centerCanvas( canvasElement )
{
var left = window.innerWidth / 2 - canvasElement.width / 2;
var top = window.innerHeight / 2 - canvasElement.height / 2;

$( canvasElement ).css( 'left', left + 'px' );
$( canvasElement ).css( 'top', top + 'px' );
}



/*
    Resets the configurations (for when restarting the game)
 */

function resetStuff()
{
STAGE.removeAllChildren();

    // unbind the event
STAGE.onMouseDown = null;

createjs.Ticker.removeAllEventListeners();

ZIndex.clear();

EnemyShip.removeAll();
Bullet.removeAllBullets();
Ship.removeAll();

clearKeysHeld();
Message.removeAll();

$( '#GameMenu' ).css( 'display', 'none' );

COLLISION_F.length = 0;
createjs.Ticker.setPaused( false );


WORLD.DrawDebugData();
STAGE.update();
}


function tick( event )
{
if ( event.paused )
    {
    return;
    }

var a;

    // check if there's collisions to deal with
for (a = COLLISION_F.length - 1 ; a >= 0 ; a--)
    {
    COLLISION_F[ a ]();
    }

COLLISION_F.length = 0;

Bullet.cleanAll();

    // call the ticks of the ships/bullets/etc
for (a = Ship.all.length - 1 ; a >= 0 ; a--)
    {
    Ship.all[ a ].tick( event );
    }

for (a = EnemyShip.all.length - 1 ; a >= 0 ; a--)
    {
    EnemyShip.all[ a ].tick( event );
    }

for (a = EnemyShip.all_spawning.length - 1 ; a >= 0 ; a--)
    {
    EnemyShip.all_spawning[ a ].tick( event );
    }

for (a = Bullet.all_bullets.length - 1 ; a >= 0 ; a--)
    {
    Bullet.all_bullets[ a ].tick( event );
    }

GAME_OBJECT.tick( event );

WORLD.Step(
    1 / 60,     // frame-rate
    10,         // velocity iterations
    10          // position iterations
    );
WORLD.DrawDebugData();
WORLD.ClearForces();

STAGE.update();
}


