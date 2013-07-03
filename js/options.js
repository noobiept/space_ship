(function(window)
{
function Options()
{

}

var OPTIONS = {
    music : true
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
    if ( typeof options.music !== 'undefined' )
        {
        OPTIONS.music = options.music;
        }
    }
};


/**
    @param {Boolean} trueFalse
 */

Options.setMusic = function( trueFalse )
{
OPTIONS.music = trueFalse;
};


Options.getMusic = function()
{
return OPTIONS.music;
};


window.Options = Options;

}(window));