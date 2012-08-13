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

    
function MainMenu()
{
CURRENT_ENTRY_SELECTED = 0;

clearInterval( LOADING_INTERVAL );

resetStuff();


MainMenu.loadAnimation();


$( document ).bind( "keyup", keyboardEvents );

Ticker.addListener( MainMenu.tick );

STAGE.update();
}


    // holds references to functions that get called when an entry is selected
var ENTRIES = [ 

    startGame,
    startEndlessMode

    ];

    // of the ENTRIES above
var CURRENT_ENTRY_SELECTED = 0;

    // number of entries in the menu
var NUMBER_OF_ENTRIES = 2;

    // the name of the animations (order matters)
var ENTRY_ANIMATIONS = [ 'startGame', 'endlessMode' ];

    // reference to the BitmapAnimation of the menu
var MENU_ANIMATION;



/*
    Load the images/animations of the menu
 */

MainMenu.loadAnimation = function()
{
var spriteConfig = {
    animations: {
        
        startGame: {
            frames: [ 0 ],
            next: 'startGame',
            frequency: 10
            },
        
        endlessMode: {
            frames: [ 1 ],
            next: 'endlessMode',
            frequency: 10
            }
        },
    frames: {
        width: 800,
        height: 400
        },
    images: [ 'images/main_menu/main_menu.png' ]
    };


var sprite = new SpriteSheet( spriteConfig );

var menu = new BitmapAnimation( sprite );

menu.x = 0;
menu.y = 0;

menu.gotoAndPlay('startGame');

MENU_ANIMATION = menu;

STAGE.addChild( menu );
};




function keyboardEvents( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    $( document ).unbind( "keyup" );

    ENTRIES[ CURRENT_ENTRY_SELECTED ]();
    }

else if (key == EVENT_KEY.downArrow)
    {
    MainMenu.selectNextEntry();
    }
    
else if (key == EVENT_KEY.upArrow)
    {
    MainMenu.selectPreviousEntry();
    }
}



/*
    Select the next entry on the menu (update the animation)
 */

MainMenu.selectNextEntry = function()
{
CURRENT_ENTRY_SELECTED++;

if (CURRENT_ENTRY_SELECTED + 1 > NUMBER_OF_ENTRIES)
    {
    CURRENT_ENTRY_SELECTED = 0;
    }
    
MENU_ANIMATION.gotoAndPlay( ENTRY_ANIMATIONS[ CURRENT_ENTRY_SELECTED ] );
}


/*
    Select the previous entry on the menu (update the animation)
 */

MainMenu.selectPreviousEntry = function()
{
CURRENT_ENTRY_SELECTED--;

if (CURRENT_ENTRY_SELECTED < 0)
    {
    CURRENT_ENTRY_SELECTED = NUMBER_OF_ENTRIES - 1;
    }

MENU_ANIMATION.gotoAndPlay( ENTRY_ANIMATIONS[ CURRENT_ENTRY_SELECTED ] );    
};




MainMenu.tick = function()
{
STAGE.update();
};




window.MainMenu = MainMenu;

}(window));