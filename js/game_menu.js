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

"use strict";

(function(window)
{
var WEAPON_SELECTED = 0;

var WEAPON_ELEMENTS = [];

var BULLETS_LEFT_ELEMENTS = [];


function GameMenu()
{
GameMenu.clear();

var inGameBar = document.querySelector( '#InGameBar' );

    // :: Weapons Selection :: //

var weaponsContainer = inGameBar.querySelector( '#InGameBar-selectWeapon' );


var weapon1 = weaponsContainer.querySelector( '#InGameBar-weapon1' );
var weapon2 = weaponsContainer.querySelector( '#InGameBar-weapon2' );
var weapon3 = weaponsContainer.querySelector( '#InGameBar-weapon3' );
var weapon4 = weaponsContainer.querySelector( '#InGameBar-weapon4' );

WEAPON_ELEMENTS.push( weapon1, weapon2, weapon3, weapon4 );

WEAPON_SELECTED = 0;


weapon1.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 1 );
    };

weapon2.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 2 );
    };

weapon3.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 3 );
    };

weapon4.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 4 );
    };



    // :: Bullets Left :: //

var bulletsContainer = inGameBar.querySelector( '#InGameBar-bulletsLeft' );

var bulletsLeft1 = bulletsContainer.querySelector( '#InGameBar-bullets1' );
var bulletsLeft2 = bulletsContainer.querySelector( '#InGameBar-bullets2' );
var bulletsLeft3 = bulletsContainer.querySelector( '#InGameBar-bullets3' );
var bulletsLeft4 = bulletsContainer.querySelector( '#InGameBar-bullets4' );


BULLETS_LEFT_ELEMENTS.push( bulletsLeft1, bulletsLeft2, bulletsLeft3, bulletsLeft4 );


GameMenu.updateAllBulletsLeft();


    // :: Open Menu :: //

var openMenu = inGameBar.querySelector( '#InGameBar-openMenu' );

positionHtmlElement( openMenu, CANVAS.width - 60, CANVAS.height - 45 );


openMenu.onclick = function()
    {
    GameMenu.openMenu();
    };


    // :: Position the elements :: //

positionHtmlElement( weaponsContainer, 20, CANVAS.height - 50 );

positionHtmlElement( bulletsContainer, 20, CANVAS.height - 20 );

$( '#InGameBar' ).css( 'display', 'block' );
}


    // if the in game is opened or not
var IS_OPENED = false;


/*
    number is zero-based
 */

GameMenu.selectWeapon = function( number )
{
if ( number !== WEAPON_SELECTED )
    {
        // remove the css class from the previous element
    $( WEAPON_ELEMENTS[ WEAPON_SELECTED ] ).removeClass( 'WeaponsSelected' );

    WEAPON_SELECTED = number;

        // add to the new
    $( WEAPON_ELEMENTS[ WEAPON_SELECTED ] ).addClass( 'WeaponsSelected' );
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

var background = new createjs.Bitmap( 'images/game_menu/game_menu_background.png' );

background.x = 0;
background.y = 0;


    // useful for positioning the menu entries in the center of the canvas
var entryHalfWidth = 140 / 2;

    // will be the x for all entries
var centeredX = CANVAS.width / 2 - entryHalfWidth;

    // :: Toggle Music :: //

var toggleMusic = new createjs.Bitmap( 'images/game_menu/game_menu_music_off.png' );


var musicOn = true;

toggleMusic.onClick = function()
    {
    if ( musicOn )
        {
        musicOn = false;
        
        createjs.SoundJS.pause();
        }
    
    else
        {
        musicOn = true;
        
        createjs.SoundJS.resume();
        }
    };

toggleMusic.x = centeredX;
toggleMusic.y = 90;
    
    
    // :: Restart :: //

var restart = new createjs.Bitmap( 'images/game_menu/game_menu_restart.png' );    

restart.onClick = function()
    {
    createjs.Ticker.setPaused( false );
    
    IS_OPENED = false;
    
    GAME_MODE();
    };

restart.x = centeredX;
restart.y = toggleMusic.y + 70;
    
    // :: Quit :: //
    
var quit = new createjs.Bitmap( 'images/game_menu/game_menu_quit.png' );

quit.onClick = function()
    {
    createjs.Ticker.setPaused( false );
    
    IS_OPENED = false;
    
    MainMenu();
    };

quit.x = centeredX;
quit.y = restart.y + 30;
    
   
    // :: Back to the Game :: //
    
var backToGame = new createjs.Bitmap( 'images/game_menu/game_menu_back_to_game.png' );

backToGame.onClick = function()
    {
    STAGE.removeChild( background );
    STAGE.removeChild( toggleMusic );
    STAGE.removeChild( restart );
    STAGE.removeChild( quit );
    STAGE.removeChild( backToGame );
    
    createjs.Ticker.setPaused( false );
    
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
createjs.Ticker.setPaused( true );
};


/*
    Updates the number of bullets left (zero-based)
 */

GameMenu.updateBulletsLeft = function( weapon, bulletsLeft )
{
var bulletsElement = BULLETS_LEFT_ELEMENTS[ weapon ];

bulletsElement.innerText = bulletsLeft;
};


GameMenu.updateAllBulletsLeft = function()
{
for (var i = 0 ; i < BULLETS_LEFT_ELEMENTS.length ; i++)
    {
    GameMenu.updateBulletsLeft( i,MAIN_SHIP.getBulletsLeft( i ) );
    }
};


GameMenu.clear = function()
{
WEAPON_ELEMENTS.length = 0;
BULLETS_LEFT_ELEMENTS.length = 0;

IS_OPENED = false;
WEAPON_SELECTED = 0;
};


window.GameMenu = GameMenu;

}(window));