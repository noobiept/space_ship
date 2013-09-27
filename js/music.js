(function(window)
{
var SONG_NAMES = [ 'scumm_bar', 'space_ship_1' ];
var CURRENT_SONG = 0;

    // has the reference to the current music being played
var MUSIC_OBJ = null;


/**
    @param {Number} [musicNumber] Position (0 based) in the 'SONG_NAMES' array above, which tells the song to play
 */

function Music( musicNumber )
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
    interval = window.setInterval( increaseVolume, 300 );

    MUSIC_OBJ = this;

    this.sound_obj = sound;
    this.increase_interval = interval;
    }
}


Music.prototype.stop = function()
{
    // if we stop the music before the increase of the volume had ended
window.clearInterval( this.increase_interval );

var interval = null;
var sound = this.sound_obj;

var reduceVolume = function()
    {
    var volume = sound.getVolume() - 0.1;

    if ( volume < 0 )
        {
        sound.stop();

        if ( interval )
            {
            window.clearInterval( interval );
            }
        }

    else
        {
        sound.setVolume( volume );
        }
    };

reduceVolume();
interval = window.setInterval( reduceVolume, 300 );
};


Music.next = function()
{
Music.stop();

CURRENT_SONG++;

if ( CURRENT_SONG >= SONG_NAMES.length )
    {
    CURRENT_SONG = 0;
    }

new Music( CURRENT_SONG );
};


Music.stop = function()
{
if ( MUSIC_OBJ )
    {
    MUSIC_OBJ.stop();

    MUSIC_OBJ = null;
    }
};


window.Music = Music;

}(window));
