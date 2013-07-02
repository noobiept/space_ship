"use strict";

(function(window)
{
var ENTRY_SELECTED = 0;

    // has the functions to call when choosing an entry
var ENTRIES = [];

    // has the html elements of the entries
var ENTRIES_ELEMENTS = [];

function MainMenu()
{

}

    
MainMenu.open = function()
{
if ( LOADING_MESSAGE )
    {
    LOADING_MESSAGE.remove();

    LOADING_MESSAGE = null;
    }

if ( MUSIC )
    {
    MUSIC.stop();

    MUSIC = null;
    }


resetStuff();
MainMenu.cleanUp();


var menu = document.querySelector( '#MainMenu' );

var startGame = menu.querySelector( '#MainMenu-startGame' );
var endlessMode = menu.querySelector( '#MainMenu-endlessMode' );
var options = menu.querySelector( '#MainMenu-options' );

ENTRIES.push( MainMenu.startGame, MainMenu.endlessMode, MainMenu.openOptions );

ENTRIES_ELEMENTS.push( startGame, endlessMode, options );

centerHtmlElement( menu, 90 );

$( menu ).css( 'display', 'block' );

startGame.onclick = MainMenu.startGame;
endlessMode.onclick = MainMenu.endlessMode;
options.onclick = MainMenu.openOptions;

ENTRY_SELECTED = 0;
$( startGame ).addClass( 'MainMenu-entrySelected' );

$( document ).bind( "keyup", MainMenu.keyboardEvents );


STAGE.update();
};




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


MainMenu.openOptions = function()
{
MainMenu.cleanUp();

var options = document.querySelector( '#Options' );


    // :: Music :: //

var music = options.querySelector( '#Options-music' );
var musicValue = music.querySelector( 'span' );

$( musicValue ).text( boolToOnOff( Options.getMusic() ) );

music.onclick = function()
    {
    if ( $( musicValue ).text() == 'On' )
        {
        $( musicValue ).text( 'Off' );

        Options.setMusic( false );
        }

    else
        {
        $( musicValue ).text( 'On' );

        Options.setMusic( true );
        }
    };


var back = options.querySelector( '#Options-back' );

back.onclick = function()
    {
    MainMenu.open();
    };


$( options ).css( 'display', 'block' );

centerElement( options );
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
$( '#MainMenu' ).css( 'display', 'none' );
$( '#Options' ).css( 'display', 'none' );

$( document ).unbind( "keyup" );


$( ENTRIES_ELEMENTS[ ENTRY_SELECTED ] ).removeClass( 'MainMenu-entrySelected' );

ENTRY_SELECTED = 0;

ENTRIES.length = 0;
};



window.MainMenu = MainMenu;

}(window));