/*global Stage, Text, Ship, EnemyMoveHorizontally, Ticker, Bullets, handleKeyDown, handleKeyUp, PreloadJS, mainMenu, SoundJS, EnemyRotateAround, GameStatistics, GameMenu, getRandomInt, updateLoading*/
/*jslint vars: true, white: true*/
    
"use strict";    

/*
    Issues:
    
        - when opening the menu, it is still possible to click the 'menu' button again..

 */

    
    // this sets the namespace for CreateJS to the window object, so you can instantiate objects without specifying 
    // the namespace: "new Graphics()" instead of "new createjs.Graphics()"
var createjs = window;


    // global variables
var STAGE;
var CANVAS;    


var PRELOAD;
var LOADING_INTERVAL = 0;
    
var LOADING_MESSAGE;
    
    
var MAIN_SHIP;
    
    
function initialLoad()
{
PRELOAD = new PreloadJS();

var manifest = [
    { id:"game_music", src: "sound/scumm_bar.ogg" }    // just testing
    ];

PRELOAD.onComplete = mainMenu;
PRELOAD.installPlugin(SoundJS);
PRELOAD.loadManifest(manifest);

    // get a reference to the canvas we'll be working with
CANVAS = document.querySelector( "#mainCanvas" );

    // create a stage object to work with the canvas. This is the top level node in the display list
STAGE = new Stage( CANVAS );

LOADING_MESSAGE = new Text("Loading", "bold 20px Arial", "rgb(255, 255, 255)");

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
    

    
    
function startGame() 
{
STAGE.removeAllChildren();

Ticker.removeAllListeners();


GameStatistics.start();


MAIN_SHIP = new Ship();

MAIN_SHIP.x = CANVAS.width / 2;
MAIN_SHIP.y = CANVAS.height / 2;


STAGE.addChild( MAIN_SHIP );


    // so that .tick() of EnemyShip/Ship/... is called automatically
Ticker.addListener( MAIN_SHIP );
Ticker.addListener( window );
Ticker.addListener( Bullets );


    // call update on the stage to make it render the current display list to the canvas
STAGE.update();


    //register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;


STAGE.onMouseMove = function( event ) { MAIN_SHIP.handleMouseMove( event ); };
STAGE.onMouseDown = function( event ) { MAIN_SHIP.handleClick( event ); };


//SoundJS.play("game_music", SoundJS.INTERRUPT_NONE ,0 ,0, -1);

GameMenu();
}


    // from how many ticks, until next enemy
var NEXT_ENEMY_TICKS = 30;

var COUNT_TICKS_NEXT_ENEMY = 0;



function tick()
{
COUNT_TICKS_NEXT_ENEMY--;

if (COUNT_TICKS_NEXT_ENEMY < 0)
    {
    COUNT_TICKS_NEXT_ENEMY = NEXT_ENEMY_TICKS;
    
    var enemyTypes = [ EnemyMoveHorizontally, EnemyRotateAround ];
    
    var enemy = new enemyTypes[ getRandomInt(0, enemyTypes.length - 1 ) ]();
    
    
    enemy.x = getRandomInt( 0, CANVAS.width );
    enemy.y = getRandomInt( 0, CANVAS.height );


    STAGE.addChild( enemy );
    Ticker.addListener( enemy );
    }
    

    // check if enemy bullets hit our ship
checkIfBulletsHitAnything( [ MAIN_SHIP ], Bullets.enemies );

    // check if our bullets hit the enemy
checkIfBulletsHitAnything( EnemyShip.all, Bullets.allies );

STAGE.update();
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
        bulletX = bullet.shape.x;
        bulletY = bullet.shape.y;
        
        
            // a bullet is a two pixel line //HERE pode variar
            // to simplify, lets use a square for the collision detection
        bulletLeftSide = bulletX - 1;
        bulletRightSide = bulletX + 1;
        bulletUpSide = bulletY - 1;
        bulletDownSide = bulletY + 1;
        
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
            ship.damageTaken( ship_index );
            
                // breaks this loop
            return false;   
            }
        });
    });

}





