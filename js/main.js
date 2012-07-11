/*global Stage, Text, Ship, EnemyShip, Ticker, Bullets, handleClick, handleKeyDown, handleKeyUp, handleMouseMove*/
/*jslint vars: true, white: true*/
    
"use strict";    
    
    // this sets the namespace for CreateJS to the window object, so you can instantiate objects without specifying 
    // the namespace: "new Graphics()" instead of "new createjs.Graphics()"
var createjs = window;

    // global variables
var STAGE;
var CANVAS;    


    
function init() {
    // get a reference to the canvas we'll be working with
CANVAS = document.querySelector( "#mainCanvas" );

    // create a stage object to work with the canvas. This is the top level node in the display list
STAGE = new Stage( CANVAS );


var text = new Text("Enemies killed:", "16px Arial", "#777");


    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
STAGE.addChild( text );

    // position the text on screen, relative to the stage coordinates
text.x = CANVAS.width - 100;
text.y = 40;


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
}



function tick()
{
Bullets.tick();
    
STAGE.update();
}


