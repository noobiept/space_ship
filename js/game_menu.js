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

/*global Text, STAGE, Ticker, CANVAS, Shape, SoundJS, SpriteSheet, BitmapAnimation*/
/*jslint vars: true, white: true*/


"use strict";

(function(window)
{

function GameMenu()
{
GameMenu.addMenuButton();
GameMenu.addWeaponsSelection();

    // reset the variable
IS_OPENED = false;
}

    // if the in game is opened or not
var IS_OPENED = false;



GameMenu.addMenuButton = function()
{
var spriteSheet = {

    animations: {
        main: {
            frames: [ 0 ],
            next: "main"
            },
        onMouseOver: {
            frames: [ 1 ],
            next: "onMouseOver"
            }
        },
    frames: {
        width: 60,
        height: 35
        },
    images: [ "images/open_game_menu.png" ]
    };
    
var menuButtonSprite = new SpriteSheet( spriteSheet );

var menuButton = new BitmapAnimation( menuButtonSprite ); 

menuButton.gotoAndPlay("main");

menuButton.x = CANVAS.width - 60;
menuButton.y = CANVAS.height - 50;

menuButton.onClick = function()
    {
    if ( IS_OPENED === false )
        {
        GameMenu.openMenu();    
        }
    };

menuButton.onMouseOver = function()
    {
    menuButton.gotoAndPlay("onMouseOver");
    };
    
menuButton.onMouseOut = function()
    {
    menuButton.gotoAndPlay("main");
    };
    
    
STAGE.addChild( menuButton );
};



GameMenu.addWeaponsSelection = function()
{
var weaponsSprite = {

    animations: {
        weapon1: {
            frames: [ 0 ],
            next: "weapon1"
            },
        weapon2: {
            frames: [ 1 ],
            next: "weapon2"
            },
        weapon3: {
            frames: [ 2 ],
            next: "weapon3"
            },
        weapon4: {
            frames: [ 3 ],
            next: "weapon4"
            }
        },
    frames: {
        width: 400,
        height: 35
        },
    images: [ "images/weapons_selection.png" ]
    };
    
var sprite = new SpriteSheet( weaponsSprite );

var weapons = new BitmapAnimation( sprite ); 

weapons.gotoAndPlay("weapon1");

weapons.x = 20;
weapons.y = CANVAS.height - 50;


GameMenu.weaponsBitmap = weapons;

STAGE.addChild( weapons );
};



GameMenu.selectWeapon = function( number )
{
if ( number === 1 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon1");
    }

else if ( number === 2 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon2");
    }

else if ( number === 3 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon3");
    }

else if ( number === 4 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon4");
    }
};





GameMenu.isOpened = function()
{
return IS_OPENED;
};





GameMenu.openMenu = function()
{
IS_OPENED = true;

    // :: Background :: //

var background = new Bitmap( 'images/game_menu/game_menu_background.png' );

background.x = 0;
background.y = 0;


    // useful for positioning the menu entries in the center of the canvas
var entryHalfWidth = 140 / 2;

    // will be the x for all entries
var centeredX = CANVAS.width / 2 - entryHalfWidth;

    // :: Toggle Music :: //

var toggleMusic = new Bitmap( 'images/game_menu/game_menu_music_off.png' );


var musicOn = true;

toggleMusic.onClick = function()
    {
    if ( musicOn )
        {
        musicOn = false;
        
        SoundJS.pause();
        }
    
    else
        {
        musicOn = true;
        
        SoundJS.resume();
        }
    };

toggleMusic.x = centeredX;
toggleMusic.y = 90;
    
    
    // :: Restart :: //

var restart = new Bitmap( 'images/game_menu/game_menu_restart.png' );    

restart.onClick = function()
    {
    Ticker.setPaused( false );
    
    IS_OPENED = false;
    
    startGame();
    };

restart.x = centeredX;
restart.y = toggleMusic.y + 70;
    
    // :: Quit :: //
    
var quit = new Bitmap( 'images/game_menu/game_menu_quit.png' );

quit.onClick = function()
    {
    Ticker.setPaused( false );
    
    IS_OPENED = false;
    
    mainMenu();
    };

quit.x = centeredX;
quit.y = restart.y + 30;
    
   
    // :: Back to the Game :: //
    
var backToGame = new Bitmap( 'images/game_menu/game_menu_back_to_game.png' );

backToGame.onClick = function()
    {
    STAGE.removeChild( background );
    STAGE.removeChild( toggleMusic );
    STAGE.removeChild( restart );
    STAGE.removeChild( quit );
    STAGE.removeChild( backToGame );
    
    Ticker.setPaused( false );
    
    IS_OPENED = false;
    };

backToGame.x = centeredX;
backToGame.y = quit.y + 70;
    
    
STAGE.addChild( background );
STAGE.addChild( toggleMusic );
STAGE.addChild( restart );
STAGE.addChild( quit );
STAGE.addChild( backToGame );

STAGE.update();

clearKeysHeld();

    // fix problem when the game menu isn't shown the first time it is opened
setTimeout( function() 
    { 
    //Ticker.setPaused( true ); 
    STAGE.update();
    }, 50 );

    // stop the game
Ticker.setPaused( true );
};



window.GameMenu = GameMenu;

}(window));