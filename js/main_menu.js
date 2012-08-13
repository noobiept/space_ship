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

/*global LOADING_INTERVAL, STAGE, Text, CANVAS, $, EVENT_KEY, GAME_MODE*/
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

    StartGame,
    EndlessMode

    ];

    // of the ENTRIES above
var CURRENT_ENTRY_SELECTED = 0;

    // number of entries in the menu
var NUMBER_OF_ENTRIES = 2;


    // reference to the BitmapAnimation of the menu entries
var ENTRY_ANIMATIONS = [];



/*
    Load the images/animations of the menu
 */

MainMenu.loadAnimation = function()
{
    // :: Background :: //
    
var backgroundConfig = {
    animations: {
        
        main: {
            frames: [ 0 ],
            next: 'main',
            frequency: 100
            }
        
        },
    frames: {
        width: 800,
        height: 400
        },
    images: [ 'images/main_menu/background.png' ]
    };


var backgroundSprite = new SpriteSheet( backgroundConfig );

var background = new BitmapAnimation( backgroundSprite );

background.x = 0;
background.y = 0;

background.gotoAndPlay('main');

STAGE.addChild( background );


    // :: Menu Text :: //
      
var menuMessage = new Text("Menu", "32px Arial", "rgb(255, 255, 255)");

menuMessage.textAlign = "center";

menuMessage.x = CANVAS.width / 2;
menuMessage.y = 100;

STAGE.addChild( menuMessage );

    // :: Start game :: //
    
var entryWidth = 240;
var entryHeight = 60;
    
var startGameConfig = {
    animations: {
        
        selected: {
            frames: [ 0 ],
            next: 'selected',
            frequency: 100
            },
            
        unselected: {
            frames: [ 1 ],
            next: 'unselected',
            frequency: 100
            }
        
        },
    frames: {
        width: entryWidth,
        height: entryHeight
        },
    images: [ 'images/main_menu/start_game.png' ]
    };


var startGameSprite = new SpriteSheet( startGameConfig );

var startGame = new BitmapAnimation( startGameSprite );

startGame.x = CANVAS.width / 2 - entryWidth / 2;
startGame.y = 150;

startGame.gotoAndPlay('selected');

STAGE.addChild( startGame );

startGame.onClick = function()
    {
    MainMenu.cleanUp();
    
    StartGame();
    };


    // :: Endless Mode :: //
    
    
var endlessConfig = {
    animations: {
        
        selected: {
            frames: [ 0 ],
            next: 'seletect',
            frequency: 100
            },
            
        unselected: {
            frames: [ 1 ],
            next: 'unselected',
            frequency: 100
            }
        
        },
    frames: {
        width: entryWidth,
        height: entryHeight
        },
    images: [ 'images/main_menu/endless_mode.png' ]
    };


var endlessSprite = new SpriteSheet( endlessConfig );

var endless = new BitmapAnimation( endlessSprite );

endless.x = CANVAS.width / 2 - entryWidth / 2;
endless.y = startGame.y + 60;

endless.gotoAndPlay('unselected');

STAGE.addChild( endless );

endless.onClick = function()
    {
    MainMenu.cleanUp();
    
    EndlessMode();
    };


    // keep a reference to change the animation later
ENTRY_ANIMATIONS = [ startGame, endless ];
};




function keyboardEvents( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    MainMenu.cleanUp();

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
var previousEntry = CURRENT_ENTRY_SELECTED;

CURRENT_ENTRY_SELECTED++;

if (CURRENT_ENTRY_SELECTED + 1 > NUMBER_OF_ENTRIES)
    {
    CURRENT_ENTRY_SELECTED = 0;
    }
    
ENTRY_ANIMATIONS[ previousEntry ].gotoAndPlay( 'unselected' );
ENTRY_ANIMATIONS[ CURRENT_ENTRY_SELECTED ].gotoAndPlay( 'selected' );
};


/*
    Select the previous entry on the menu (update the animation)
 */

MainMenu.selectPreviousEntry = function()
{
var previousEntry = CURRENT_ENTRY_SELECTED;

CURRENT_ENTRY_SELECTED--;

if (CURRENT_ENTRY_SELECTED < 0)
    {
    CURRENT_ENTRY_SELECTED = NUMBER_OF_ENTRIES - 1;
    }

ENTRY_ANIMATIONS[ previousEntry ].gotoAndPlay( 'unselected' );
ENTRY_ANIMATIONS[ CURRENT_ENTRY_SELECTED ].gotoAndPlay( 'selected' ); 
};



/*
    Call when moving away from the MainMenu
 */

MainMenu.cleanUp = function()
{
$( document ).unbind( "keyup" );
};



MainMenu.tick = function()
{
STAGE.update();
};




window.MainMenu = MainMenu;

}(window));