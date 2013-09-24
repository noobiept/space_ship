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
Music.stop();

if ( musicNumber < 0 || musicNumber >= SONG_NAMES.length )
    {
    musicNumber = 0;
    }

CURRENT_SONG = musicNumber;

var volume = Options.getMusicVolume();

if ( volume > 0 )
    {
        // start with 0 volume
    var sound = createjs.Sound.play( SONG_NAMES[ musicNumber ], createjs.Sound.INTERRUPT_NONE ,0 ,0, -1, 0 );
    var interval = null;

    var increaseVolume = function()
        {
        var newVolume = sound.getVolume() + 0.1;

            // we achieved the volume we wanted
        if ( newVolume > volume )
            {
            sound.setVolume( volume );

            if ( interval )
                {
                window.clearInterval( interval );
                }
            }

            // keep raising the volume
        else
            {
            sound.setVolume( newVolume );
            }
        };

    increaseVolume();
    interval = window.setInterval( increaseVolume, 400 );

    SOUND_OBJ = sound;
    }
};


Music.stop = function()
{
if ( SOUND_OBJ )
    {
    var previousSound = SOUND_OBJ;
    var interval = null;

    var reduceVolume = function()
        {
        var volume = previousSound.getVolume() - 0.1;

        if ( volume < 0 )
            {
            previousSound.stop();

            if ( interval )
                {
                window.clearInterval( interval );
                }
            }

        else
            {
            previousSound.setVolume( volume );
            }
        };


    reduceVolume();
    interval = window.setInterval( reduceVolume, 400 );

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
