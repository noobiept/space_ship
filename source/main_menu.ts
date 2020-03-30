import { CANVAS, resetStuff, startGameMode, STAGE, setMapMode, removeLoadingMessage } from './main'
import * as Music from './music'
import * as Options from './options'
import { EVENT_KEY } from './utilities';
import RandomMaps from './random_maps';
import PredefinedMaps from './predefined_maps';
import EndlessMode from './endless_mode';


var ENTRY_SELECTED = 0;

    // has the functions to call when choosing an entry
var ENTRIES = [];

    // has the html elements of the entries
var ENTRIES_ELEMENTS = [];


export function open()
{
removeLoadingMessage();

CANVAS.style.display = 'none';

Music.stop();
resetStuff();
cleanUp();

var menu = document.querySelector( '#MainMenu' );

const predefinedMaps = document.getElementById( 'MainMenu-predefinedMaps' );
const randomMaps = document.getElementById( 'MainMenu-randomMaps' );
const endlessMode = document.getElementById( 'MainMenu-endlessMode' );
const options = document.getElementById( 'MainMenu-options' );
const donate = document.getElementById( 'MainMenu-donate' );

ENTRIES.push( predefinedMaps, randomMaps, endlessMode, openOptions, openDonate );

ENTRIES_ELEMENTS.push( predefinedMaps, randomMaps, endlessMode, options, donate );

$( menu ).css( 'display', 'block' );

predefinedMaps.onclick = openPredefinedMaps;
randomMaps.onclick = openRandomMaps;
endlessMode.onclick = openEndlessMode;
options.onclick = openOptions;

ENTRY_SELECTED = 0;
$( predefinedMaps ).addClass( 'MainMenu-entrySelected' );

$( document ).bind( "keyup", keyboardEvents );

STAGE.update();
};


function openPredefinedMaps( event )
{
cleanUp();
setMapMode(PredefinedMaps);
startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
event.stopPropagation();
};


function openRandomMaps( event )
{
cleanUp();
setMapMode(RandomMaps);
startGameMode();

event.stopPropagation();
};


function openEndlessMode( event )
{
cleanUp();
setMapMode(EndlessMode);
startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
event.stopPropagation();
};


function openOptions( event )
{
cleanUp();

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

const back = document.getElementById( 'Options-back' );
back.onclick = function()
    {
    Options.save();
    open();
    };

$( options ).css( 'display', 'block' );
};


function openDonate()
{
document.getElementById( 'MainMenu-donate' ).click();
};


function keyboardEvents( event )
{
var key = event.keyCode;

    // start the game
if (key === EVENT_KEY.enter)
    {
    ENTRIES[ ENTRY_SELECTED ]( event );
    }

else if (key === EVENT_KEY.downArrow)
    {
    selectNextEntry();
    }

else if (key === EVENT_KEY.upArrow)
    {
    selectPreviousEntry();
    }
};


/*
    Select the next entry on the menu (update the animation)
 */
function selectNextEntry()
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
function selectPreviousEntry()
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
function cleanUp()
{
$( '#MainMenu' ).css( 'display', 'none' );
$( '#Options' ).css( 'display', 'none' );

$( document ).unbind( "keyup" );

$( ENTRIES_ELEMENTS[ ENTRY_SELECTED ] ).removeClass( 'MainMenu-entrySelected' );

ENTRY_SELECTED = 0;
ENTRIES.length = 0;
};
