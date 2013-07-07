"use strict";

/*
    Dependencies:

        - jquery : 2.0
        - jqueryui : 1.10
            - slider
        - createjs
            - easeljs   : 0.6
            - preloadjs : 0.3
            - soundjs   : 0.4
            - tweenjs   : 0.4
        - box2dweb : 2.1.a

    Issues:
    
        - the EnemyKamikaze doesn't work too well
        - levels ending even though there's still enemies in the map (some bug somewhere, where some objects being leaked?)

    to doo:

        collisions:

            - sniper bullet is too fast for the shape/body to be synced
            - cant fire if mouse is outside of canvas (or maybe pause the game when the mouse is outside of the canvas?...)

        - change the weapons variables in Ship to be zero-based ( this.weaponSelected )
        - add enemies with more energy (and maybe show above the unit how many more hitpoints it has)

        - random maps (like 1 map, random 50 units.. with certain time between each new unit. map 2, more units etc...)
        - different color for bullets (ship vs enemies)
 */


    // global variables

var CANVAS;
var CANVAS_DEBUG;

var DEBUG = true;


    // createjs

var STAGE;
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
var GAME_MENU_HEIGHT = 65;

    
var MAIN_SHIP;

var ENEMY_TYPES = [

    EnemyMoveHorizontally,
    EnemyRotateAround,
    EnemyKamikaze,
    EnemyRocks

    ];
    

    
var GAME_MODE = null;

var MUSIC = null;

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
    enemy_spawning: 0       // doesn't collide with anything, during the spawn phase
    };


var LOADING_MESSAGE;
    
window.onload = function()
{
Options.load();

    // get a reference to the canvas we'll be working with
CANVAS = document.querySelector( "#mainCanvas" );

    // canvas for debugging the physics
CANVAS_DEBUG = document.querySelector( '#debugCanvas' );

centerCanvas( CANVAS );
centerCanvas( CANVAS_DEBUG );

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
    { id: "game_music", src: "sound/scumm_bar.ogg" }    // just testing
    ];


LOADING_MESSAGE = new Message({ text: 'Loading' });

PRELOAD.installPlugin( createjs.Sound );
PRELOAD.addEventListener( 'progress', updateLoading );
PRELOAD.addEventListener( 'complete', MainMenu.open );
PRELOAD.loadManifest( manifest, true );
};
    

window.onunload = function()
{
Options.save();
};


function updateLoading( event )
{
LOADING_MESSAGE.setText( "Loading " + ( event.progress*100 | 0 ) + "%" );
}
    
    
    
/*

 */
   
function initGame()
{
resetStuff();

GameStatistics.start();


GAME_WIDTH = CANVAS.width;
GAME_HEIGHT = CANVAS.height - GAME_MENU_HEIGHT;


MAIN_SHIP = new Ship();



    // so that .tick() of EnemyShip/Ship/... is called automatically
createjs.Ticker.addListener( MAIN_SHIP );
createjs.Ticker.addListener( window );


    // call update on the stage to make it render the current display list to the canvas
STAGE.update();


    // set up collision detection
var listener = new b2ContactListener;

listener.BeginContact = collisionDetection;

WORLD.SetContactListener( listener );


    //register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;


STAGE.onMouseMove = function( event ) { MAIN_SHIP.handleMouseMove( event ); };
//STAGE.onMouseDown = function( event ) { MAIN_SHIP.handleClick( event ); };
//window.onmousemove = function( event ) { MAIN_SHIP.handleMouseMove( event ); };
window.onclick = function( event ) { MAIN_SHIP.handleClick( event ) };


var musicVolume = Options.getMusicVolume();

if ( musicVolume > 0 )
    {
    MUSIC = createjs.Sound.play( "game_music", createjs.Sound.INTERRUPT_NONE ,0 ,0, -1, Options.getMusicVolume() );
    }


GameMenu();
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

        //HERE -- poder levar dano das proprias balas?..
    if ( !bulletObject.isEnemy )
        {
        return;
        }

    COLLISION_F.push(
        function()
            {
                // remove the bullet
            bulletObject.remove();

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

        //HERE -- poder levar dano das proprias balas?..
    if ( bulletObject.isEnemy )
        {
        return;
        }

    COLLISION_F.push(
        function()
            {
                // remove the bullet
            bulletObject.remove();

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

createjs.Ticker.removeAllListeners();

ZIndex.clear();

EnemyShip.removeAll();
Weapons.removeAllBullets();
Ship.removeAll();

    // reset the velocity and damage
$( ENEMY_TYPES ).each(function(index, enemyType)
    {
    enemyType.reset();
    });
    
clearKeysHeld();


$( '#GameMenu' ).css( 'display', 'none' );

COLLISION_F.length = 0;


    // clear any bodies that for whatever reason aren't removed
var nextBody = WORLD.GetBodyList();

while ( nextBody )
    {
    var body = nextBody;

    nextBody = body.GetNext();

    WORLD.DestroyBody( body );
    }

WORLD.DrawDebugData();

STAGE.update();
}
    
    



function tick()
{
    // check if there's collisions to deal with
for (var i = 0 ; i < COLLISION_F.length ; i++)
    {
        // call the function
    COLLISION_F[ i ]();

        // and remove it from array
    COLLISION_F.splice( i, 1 );

    i--;
    }


    // call the tick() of the current game mode
GAME_MODE.tick();


WORLD.Step(
    1 / 60,     // frame-rate
    10,         // velocity iterations
    10          // position iterations
    );

WORLD.DrawDebugData();
WORLD.ClearForces();

STAGE.update();
}


