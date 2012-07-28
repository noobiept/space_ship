/*global LOADING_INTERVAL, STAGE, Text, CANVAS, $, EVENT_KEY, startGame*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{

    
function mainMenu()
{
clearInterval( LOADING_INTERVAL );

resetStuff();

var menuMessage = new Text("Menu", "20px Arial", "rgb(255, 255, 255)");

menuMessage.textAlign = "center";

menuMessage.x = CANVAS.width / 2;
menuMessage.y = 100;

var start = new Text("Press Enter to Start", "16px Arial", "rgb(120, 120, 120)");

start.textAlign = "center";

start.x = CANVAS.width / 2;
start.y = menuMessage.y + 50;


$( document ).bind( "keyup", keyboardEvents );

STAGE.addChild( menuMessage );
STAGE.addChild( start );

STAGE.update();
}


function keyboardEvents( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    $( document ).unbind( "keyup" );
    
    startGame();
    }
}


window.mainMenu = mainMenu;

}(window));