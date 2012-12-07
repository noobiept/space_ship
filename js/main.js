/*
    Copyright - 2012 - Pedro Ferreira

    This file is part of space_ship_game.

    space_ship_game is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    space_ship_game is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with space_ship_game.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global createjs, Ship, EnemyMoveHorizontally, Weapons, handleKeyDown, handleKeyUp, MainMenu, EnemyRotateAround, GameStatistics, GameMenu, getRandomInt, updateLoading, EnemyKamikaze, ZIndex, EnemyShip, $, clearKeysHeld, EnemyRocks*/
/*jslint vars: true, white: true*/
    
"use strict";    

/*
    Issues:
    
        - sometimes, one of the enemies can't be killed...
        - the game_menu entries have to have a background color, so that we can click in the entry (instead of the text)
        - the EnemyKamikaze doesn't work too well
        - when returning from the game_menu with two keys held, top and left arrow for example, it doesn't continue going to the top left corner, but to the left only
        - tweenjs not working
        
        
    to doo:
    
        - mines should go away after some time

        collisions:

            - you can outrun the bullets (and collide with them)
            - sniper bullet is too fast for the shape/body to be synced
            - cant fire if mouse is outside of canvas

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
var b2MassData = Box2D.Collision.Shapes.b2MassData;
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


var LOADING_INTERVAL = 0;
    
var LOADING_MESSAGE;
    
    
var MAIN_SHIP;
    
    
var ENEMY_TYPES = [

    EnemyMoveHorizontally,
    EnemyRotateAround,
    EnemyKamikaze,
    EnemyRocks

    ];
    

    
var GAME_MODE = null;
    

    // :: Collision Detection :: //

    // objects identification (for the collision detection)
var TYPE_SHIP = 0;
var TYPE_ENEMY = 1;
var TYPE_BULLET = 2;

    // has functions to be called later (related to a collision). Have to remove the elements after executing the function
var COLLISION_F = [];

    
window.onload = function()
{
PRELOAD = new createjs.PreloadJS();

var manifest = [
    { id:"game_music", src: "sound/scumm_bar.ogg" }    // just testing
    ];

PRELOAD.onComplete = MainMenu;
PRELOAD.installPlugin( createjs.SoundJS );
PRELOAD.loadManifest( manifest, true );

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

LOADING_MESSAGE = new createjs.Text("Loading", "bold 20px Arial", "rgb(255, 255, 255)");

LOADING_MESSAGE.maxWidth = 500;
LOADING_MESSAGE.textAlign = "center";
LOADING_MESSAGE.x = CANVAS.width / 2;
LOADING_MESSAGE.y = CANVAS.height / 2;

STAGE.addChild( LOADING_MESSAGE );
STAGE.update();

LOADING_INTERVAL = setInterval(updateLoading, 200);
};
    

function updateLoading() 
{
LOADING_MESSAGE.text = "Loading " + (PRELOAD.progress*100|0) + "%";

STAGE.update();
}
    
    
    
/*

 */
   
function initGame()
{
resetStuff();

GameStatistics.start();


GAME_WIDTH = CANVAS.width;
GAME_HEIGHT = CANVAS.height - 60;


MAIN_SHIP = new Ship();


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


    // so that .tick() of EnemyShip/Ship/... is called automatically
createjs.Ticker.addListener( MAIN_SHIP );
createjs.Ticker.addListener( window );

STAGE.enableMouseOver();

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
STAGE.onMouseDown = function( event ) { MAIN_SHIP.handleClick( event ); };


//createjs.SoundJS.play("game_music", SoundJS.INTERRUPT_NONE ,0 ,0, -1);

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
}
    
    


function addNewEnemy( enemyObject )
{
enemyObject.beforeAddToStage();
      
STAGE.addChild( enemyObject );

ZIndex.update();

createjs.Ticker.addListener( enemyObject );
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


