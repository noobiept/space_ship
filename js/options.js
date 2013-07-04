(function(window)
{
function Options()
{

}

var OPTIONS = {
    musicVolume: 1  // value between 0 and 1
    };


Options.save = function()
{
localStorage.setObject( 'options', OPTIONS );
};



Options.load = function()
{
var options = localStorage.getObject( 'options' );

if ( options )
    {
    if ( typeof options.musicVolume !== 'undefined' )
        {
        OPTIONS.musicVolume = options.musicVolume;
        }
    }
};




Options.setMusicVolume = function( value )
{
if ( value < 0 || value > 1 )
    {
    return false;
    }

OPTIONS.musicVolume = value;

return true;
};


Options.getMusicVolume = function()
{
return OPTIONS.musicVolume;
};


window.Options = Options;

}(window));