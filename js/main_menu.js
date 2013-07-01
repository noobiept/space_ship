"use strict";

(function(window)
{
var MENU_CONTAINER;

var ENTRY_SELECTED = 0;

    // has the functions to call when choosing an entry
var ENTRIES = [];

    // has the html elements of the entries
var ENTRIES_ELEMENTS = [];

    
function MainMenu()
{
if ( LOADING_MESSAGE )
    {
    LOADING_MESSAGE.remove();

    LOADING_MESSAGE = null;
    }


resetStuff();


MENU_CONTAINER = document.querySelector( '#MainMenu' );

var startGame = MENU_CONTAINER.querySelector( '#MainMenu-startGame' );
var endlessMode = MENU_CONTAINER.querySelector( '#MainMenu-endlessMode' );

ENTRIES.push( MainMenu.startGame, MainMenu.endlessMode );

ENTRIES_ELEMENTS.push( startGame, endlessMode );

centerHtmlElement( MENU_CONTAINER, 90 );

$( MENU_CONTAINER ).css( 'display', 'block' );

startGame.onclick = MainMenu.startGame;
endlessMode.onclick = MainMenu.endlessMode;


$( document ).bind( "keyup", MainMenu.keyboardEvents );


STAGE.update();
}




MainMenu.startGame = function()
{
MainMenu.cleanUp();

StartGame();
};


MainMenu.endlessMode = function()
{
MainMenu.cleanUp();

EndlessMode();
};




MainMenu.keyboardEvents = function( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    ENTRIES[ ENTRY_SELECTED ]();
    }

else if (key === EVENT_KEY.downArrow)
    {
    MainMenu.selectNextEntry();
    }
    
else if (key === EVENT_KEY.upArrow)
    {
    MainMenu.selectPreviousEntry();
    }
};



/*
    Select the next entry on the menu (update the animation)
 */

MainMenu.selectNextEntry = function()
{
var previousEntry = ENTRY_SELECTED;

ENTRY_SELECTED++;

if (ENTRY_SELECTED + 1 > ENTRIES.length)
    {
    ENTRY_SELECTED = 0;
    }

$( ENTRIES_ELEMENTS[ previousEntry ] ).removeClass( 'MainMenu-entrySelected' );

$( ENTRIES_ELEMENTS[ ENTRY_SELECTED ] ).addClass( 'MainMenu-entrySelected' );
};


/*
    Select the previous entry on the menu (update the animation)
 */

MainMenu.selectPreviousEntry = function()
{
var previousEntry = ENTRY_SELECTED;

ENTRY_SELECTED--;

if (ENTRY_SELECTED < 0)
    {
        ENTRY_SELECTED = ENTRIES.length - 1;
    }

$( ENTRIES_ELEMENTS[ previousEntry ] ).removeClass( 'MainMenu-entrySelected' );

$( ENTRIES_ELEMENTS[ ENTRY_SELECTED ] ).addClass( 'MainMenu-entrySelected' );
};



/*
    Call when moving away from the MainMenu
 */

MainMenu.cleanUp = function()
{
$( MENU_CONTAINER ).css( 'display', 'none' );

$( document ).unbind( "keyup" );

ENTRIES.length = 0;

ENTRY_SELECTED = 0;
};



window.MainMenu = MainMenu;

}(window));