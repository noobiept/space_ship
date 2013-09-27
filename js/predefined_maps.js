(function(window)
{
var NUMBER_OF_MAPS = 10;

    // has the maps configurations
var MAPS = [];

function PredefinedMaps( startingLevel )
{
    // inherit from the Maps class
Maps.call( this, { maps: MAPS, startingLevel: startingLevel } );
}


    // inherit the member functions
INHERIT_PROTOTYPE( PredefinedMaps, Maps );


PredefinedMaps.init = function()
{
var level;
var filePath;


for (var i = 0 ; i < NUMBER_OF_MAPS ; i++)
    {
    filePath = BASE_URL + 'maps/level' + (i + 1) + '.json';

    $.ajax({
        url: filePath,
        dataType: 'json',
        async: false,
        beforeSend: function(xhr)
            {
            if (xhr.overrideMimeType)
                {
                xhr.overrideMimeType("application/json");
                }
            },
        success: function(data)
            {
            MAPS.push( data );
            },

        error: function(jqXHR, textStatus, errorThrown)
            {
            console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }
};



window.PredefinedMaps = PredefinedMaps;

}(window));