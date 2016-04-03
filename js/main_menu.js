/*global Music, resetStuff, LOADING_MESSAGE, STAGE, GAME_MODE, startGameMode, PredefinedMaps, RandomMaps, EndlessMode, Options, EVENT_KEY, CANVAS*/
/*exported GAME_MODE*/
"use strict";

var MainMenu;
(function (MainMenu) {


var ENTRY_SELECTED = 0;

    // has the functions to call when choosing an entry
var ENTRIES = [];

    // has the html elements of the entries
var ENTRIES_ELEMENTS = [];


MainMenu.open = function()
{
if ( LOADING_MESSAGE )
    {
    LOADING_MESSAGE.remove();
    LOADING_MESSAGE = null;
    }

CANVAS.style.display = 'none';

Music.stop();
resetStuff();
MainMenu.cleanUp();

var menu = document.querySelector( '#MainMenu' );

var predefinedMaps = menu.querySelector( '#MainMenu-predefinedMaps' );
var randomMaps = menu.querySelector( '#MainMenu-randomMaps' );
var endlessMode = menu.querySelector( '#MainMenu-endlessMode' );
var options = menu.querySelector( '#MainMenu-options' );
var donate = menu.querySelector( '#MainMenu-donate' );

ENTRIES.push( MainMenu.predefinedMaps, MainMenu.randomMaps, MainMenu.endlessMode, MainMenu.openOptions, MainMenu.openDonate );

ENTRIES_ELEMENTS.push( predefinedMaps, randomMaps, endlessMode, options, donate );

$( menu ).css( 'display', 'block' );

predefinedMaps.onclick = MainMenu.predefinedMaps;
randomMaps.onclick = MainMenu.randomMaps;
endlessMode.onclick = MainMenu.endlessMode;
options.onclick = MainMenu.openOptions;

ENTRY_SELECTED = 0;
$( predefinedMaps ).addClass( 'MainMenu-entrySelected' );

$( document ).bind( "keyup", MainMenu.keyboardEvents );

STAGE.update();
};


MainMenu.predefinedMaps = function( event )
{
MainMenu.cleanUp();

GAME_MODE = PredefinedMaps;

startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
event.stopPropagation();
};


MainMenu.randomMaps = function( event )
{
MainMenu.cleanUp();

GAME_MODE = RandomMaps;
startGameMode();

event.stopPropagation();
};


MainMenu.endlessMode = function( event )
{
MainMenu.cleanUp();

GAME_MODE = EndlessMode;
startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
event.stopPropagation();
};


MainMenu.openOptions = function( event )
{
MainMenu.cleanUp();

var options = document.querySelector( '#Options' );

    // :: Music Volume :: //

var musicVolume = options.querySelector( '#Options-musicVolume' );
var musicVolumeSpan = musicVolume.querySelector( 'span' );

var musicVolumeValue = Math.round( Options.getMusicVolume() * 100 );

$( musicVolumeSpan ).text( musicVolumeValue + '%' );

var musicVolumeSlider = musicVolume.querySelector( '#Options-musicVolume-slider' );

$( musicVolumeSlider ).slider({
    min: 0,
    max: 100,
    step: 1,
    value: musicVolumeValue,
    range: 'min',
    slide: function( event, ui )
        {
        $( musicVolumeSpan ).text( ui.value + '%' );

        Options.setMusicVolume( ui.value / 100 );
        }
    });

var back = options.querySelector( '#Options-back' );

back.onclick = function()
    {
    Options.save();
    MainMenu.open();
    };

$( options ).css( 'display', 'block' );
};


MainMenu.openDonate = function()
{
document.getElementById( 'MainMenu-donate' ).click();
};


MainMenu.keyboardEvents = function( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    ENTRIES[ ENTRY_SELECTED ]( event );
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


})(MainMenu || (MainMenu = {}));
