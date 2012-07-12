/*global Stage, Text, Ship, EnemyShip, Ticker, Bullets, handleClick, handleKeyDown, handleKeyUp, handleMouseMove*/
/*jslint vars: true, white: true*/
    
"use strict";    
    
    // this sets the namespace for CreateJS to the window object, so you can instantiate objects without specifying 
    // the namespace: "new Graphics()" instead of "new createjs.Graphics()"
var createjs = window;


    // global variables
var STAGE;
var CANVAS;    

var SCORE = 0;
var SCORE_TEXT;

var ENERGY = 100;
var ENERGY_TEXT;


var PRELOAD;
var LOADING_INTERVAL = 0;
    
var LOADING_MESSAGE;
    
    
    
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
LOADING_MESSAGE.text = "Loading " + (PRELOAD.progress*100|0) + "%"

STAGE.update();
}
    

    
    
function startGame() 
{
STAGE.removeAllChildren();


SCORE_TEXT = new Text("Enemies killed: " + SCORE, "16px Arial", "#777");


    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
STAGE.addChild( SCORE_TEXT );

    // position the text on screen, relative to the stage coordinates
SCORE_TEXT.x = CANVAS.width - 150;
SCORE_TEXT.y = 40;


ENERGY_TEXT = new Text("Energy: " + ENERGY, "16px Arial", "#777");

STAGE.addChild( ENERGY_TEXT );

ENERGY_TEXT.x = SCORE_TEXT.x;
ENERGY_TEXT.y = SCORE_TEXT.y + 30;


var ship = new Ship();

ship.x = CANVAS.width / 2;
ship.y = CANVAS.height / 2;


STAGE.addChild( ship );

var enemyShip = new EnemyShip();

enemyShip.x = 50;
enemyShip.y = 100;

STAGE.addChild( enemyShip );

    // so that .tick() of EnemyShip/Ship/... is called automatically
Ticker.addListener( enemyShip );
Ticker.addListener( ship );
Ticker.addListener( window );

    // call update on the stage to make it render the current display list to the canvas
STAGE.update();


    //register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;


STAGE.onMouseMove = function(event) { handleMouseMove(event, ship); };
STAGE.onMouseDown = function(event) { handleClick(event, ship); };

SoundJS.play("game_music", SoundJS.INTERRUPT_NONE ,0 ,0, -1);
}


    // from how many ticks, until next enemy
var NEXT_ENEMY_TICKS = 60;

var COUNT_TICKS_NEXT_ENEMY = NEXT_ENEMY_TICKS;


function getRandomInt (min, max) 
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


function tick()
{
Bullets.tick();

COUNT_TICKS_NEXT_ENEMY--;

if (COUNT_TICKS_NEXT_ENEMY < 0)
    {
    COUNT_TICKS_NEXT_ENEMY = NEXT_ENEMY_TICKS;
    
    var enemy = new EnemyShip();
    
    enemy.x = getRandomInt( 0, CANVAS.width );
    enemy.y = getRandomInt( 0, CANVAS.height );
    
    STAGE.addChild( enemy );
    Ticker.addListener( enemy );
    }

STAGE.update();
}


