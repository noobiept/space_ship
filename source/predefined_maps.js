/*global PRELOAD, Maps, INHERIT_PROTOTYPE*/

(function(window)
{
var NUMBER_OF_MAPS = 10;

    // has the maps configurations
var MAPS = [];

function PredefinedMaps( startingLevel )
{
if ( MAPS.length == 0 )
    {
    for (var i = 0 ; i < NUMBER_OF_MAPS ; i++)
        {
        MAPS.push( PRELOAD.getResult( 'level' + (i + 1) ) );
        }
    }

    // inherit from the Maps class
Maps.call( this, { maps: MAPS, startingLevel: startingLevel } );
}

    // inherit the member functions
INHERIT_PROTOTYPE( PredefinedMaps, Maps );


window.PredefinedMaps = PredefinedMaps;

}(window));
