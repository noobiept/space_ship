(function(window)
{
function Music()
{

}

var SOUND_OBJ = null;

var SONG_NAMES = [ 'scumm_bar', 'space_ship_1' ];
var CURRENT_SONG = 0;

/**
    @param {Number} [musicNumber] Position (0 based) in the 'SONG_NAMES' array above, which tells the song to play
 */

Music.play = function( musicNumber )
{
if ( musicNumber < 0 || musicNumber >= SONG_NAMES.length )
    {
    musicNumber = 0;
    }

CURRENT_SONG = musicNumber;

var volume = Options.getMusicVolume();

if ( volume > 0 )
    {
    SOUND_OBJ = createjs.Sound.play( SONG_NAMES[ musicNumber ], createjs.Sound.INTERRUPT_NONE ,0 ,0, -1, volume );
    }
};


Music.stop = function()
{
if ( SOUND_OBJ )
    {
    SOUND_OBJ.stop();

    SOUND_OBJ = null;
    }
};


Music.next = function()
{
Music.stop();

CURRENT_SONG++;

if ( CURRENT_SONG >= SONG_NAMES.length )
    {
    CURRENT_SONG = 0;
    }

Music.play( CURRENT_SONG );
};


window.Music = Music;

}(window));
