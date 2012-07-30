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