/*global Stage, Text, Ship, EnemyShip, Ticker, Bullets, handleClick, handleKeyDown, handleKeyUp, handleMouseMove, PreloadJS, mainMenu, SoundJS, EnemyRotateAround*/
/*jslint vars: true, white: true*/
    
"use strict";    
    
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


STAGE.onMouseMove = function(event) { handleMouseMove(event, MAIN_SHIP); };
STAGE.onMouseDown = function(event) { handleClick(event, MAIN_SHIP); };

SoundJS.play("game_music", SoundJS.INTERRUPT_NONE ,0 ,0, -1);

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
    
    var enemyTypes = [ EnemyShip, EnemyRotateAround ];
    
    var enemy = new enemyTypes[ getRandomInt(0, enemyTypes.length - 1 ) ]();
    
    
    enemy.x = getRandomInt( 0, CANVAS.width );
    enemy.y = getRandomInt( 0, CANVAS.height );


    STAGE.addChild( enemy );
    Ticker.addListener( enemy );
    }

STAGE.update();
}





