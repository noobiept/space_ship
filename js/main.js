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

/*global Stage, Text, Ship, EnemyMoveHorizontally, Ticker, Weapons, handleKeyDown, handleKeyUp, PreloadJS, MainMenu, SoundJS, EnemyRotateAround, GameStatistics, GameMenu, getRandomInt, updateLoading, EnemyKamikaze, ZIndex, EnemyShip, $*/
/*jslint vars: true, white: true*/
    
"use strict";    

/*
    Issues:
    
        - sometimes, one of the enemies can't be killed...
        - the game_menu entries have to have a background color, so that we can click in the entry (instead of the text)
        - the EnemyKamikaze doesn't work too well
        - when returning from the game_menu with two keys held, top and left arrow for example, it doesn't continue going to the top left corner, but to the left only
        - tweenjs not working
        - weapon2-sniper sometimes doesnt appear the image
        
        
        
    to doo:
    
        - mines should go away after some time
    
 */


    // global variables
var STAGE;
var CANVAS;    

    // playable dimensions (the rest of the canvas is for menus/etc)
var GAME_WIDTH;
var GAME_HEIGHT;

var PRELOAD;
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
    
    
function initialLoad()
{
PRELOAD = new createjs.PreloadJS();

var manifest = [
    { id:"game_music", src: "sound/scumm_bar.ogg" }    // just testing
    ];

PRELOAD.onComplete = MainMenu;
PRELOAD.installPlugin( createjs.SoundJS );
PRELOAD.loadManifest( manifest );

    // get a reference to the canvas we'll be working with
CANVAS = document.querySelector( "#mainCanvas" );

    // create a stage object to work with the canvas. This is the top level node in the display list
STAGE = new createjs.Stage( CANVAS );

LOADING_MESSAGE = new createjs.Text("Loading", "bold 20px Arial", "rgb(255, 255, 255)");

LOADING_MESSAGE.maxWidth = 500;
LOADING_MESSAGE.textAlign = "center";
LOADING_MESSAGE.x = CANVAS.width / 2;
LOADING_MESSAGE.y = CANVAS.height / 2;

STAGE.addChild( LOADING_MESSAGE );
STAGE.update();

LOADING_INTERVAL = setInterval(updateLoading, 200);
}
    

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

MAIN_SHIP.x = GAME_WIDTH / 2;
MAIN_SHIP.y = GAME_HEIGHT / 2;


STAGE.addChild( MAIN_SHIP );

ZIndex.add( MAIN_SHIP );

    // so that .tick() of EnemyShip/Ship/... is called automatically
createjs.Ticker.addListener( MAIN_SHIP );
createjs.Ticker.addListener( window );

STAGE.enableMouseOver();

    // call update on the stage to make it render the current display list to the canvas
STAGE.update();


    //register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;


STAGE.onMouseMove = function( event ) { MAIN_SHIP.handleMouseMove( event ); };
STAGE.onMouseDown = function( event ) { MAIN_SHIP.handleClick( event ); };


//createjs.SoundJS.play("game_music", SoundJS.INTERRUPT_NONE ,0 ,0, -1);

GameMenu();
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
    
    
    
    


function checkIfBulletsHitAnything( ships, bullets )
{
var bulletX, bulletY;

var bulletLeftSide, bulletRightSide, bulletUpSide, bulletDownSide;
var enemyLeftSide, enemyRightSide, enemyUpSide, enemyDownSide;

    // jquery 'equivalent'  of forEach()
$( ships ).each(function( ship_index, ship )
    {
    $( bullets ).each(function( bullet_index, bullet )
        {
        bulletX = bullet.bulletShape.x;
        bulletY = bullet.bulletShape.y;
        
        var bulletHalfWidth = bullet.width / 2;
        var bulletHalfHeight = bullet.height / 2;
        
        
            // to simplify, lets use a rectangle for the collision detection (each type of bullet/weapon has a width/height property to tell the bullet dimensions)
        bulletLeftSide = bulletX - bulletHalfWidth;
        bulletRightSide = bulletX + bulletHalfWidth;
        bulletUpSide = bulletY - bulletHalfHeight;
        bulletDownSide = bulletY + bulletHalfHeight;
        
            // the ship is centered on 0
        var halfWidth = ship.width / 2;
        var halfHeight = ship.height / 2; 
        
            // same for the enemy
        enemyLeftSide = ship.x - halfWidth;
        enemyRightSide = ship.x + halfWidth;
        enemyUpSide = ship.y - halfHeight;
        enemyDownSide = ship.y + halfHeight;

            // check if it hits the EnemyShip
        if ( !(bulletRightSide < enemyLeftSide || bulletLeftSide > enemyRightSide || bulletDownSide < enemyUpSide || bulletUpSide > enemyDownSide) )
            
        //if ( enemy.hitTest(bulletX, bulletY) )
            {
                // remove the bullet
            bullet.remove( bullet_index );
            
                // remove the EnemyShip
            ship.damageTaken();
            
                // breaks this loop
            return false;   
            }
        });
    });

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
    // check if enemy bullets hit our ship
checkIfBulletsHitAnything( [ MAIN_SHIP ], Weapons.enemyBullets );

    // check if our bullets hit the enemy
checkIfBulletsHitAnything( EnemyShip.all, Weapons.allyBullets );

    // call the tick() of the current game mode
GAME_MODE.tick();

STAGE.update();
}


