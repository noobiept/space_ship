(function(window)
{
function RandomMaps()
{
    // inherit from the Maps class
Maps.call( this );
}


    // inherit the member functions
INHERIT_PROTOTYPE( RandomMaps, Maps );



/*
    Generates a map in a similar format as the one used in PredefinedMaps

    Differences:
        - the EnemyType is the class reference here, while in the PredefinedMaps is a string
 */

RandomMaps.prototype.generateMap = function()
{
var map = [];

    // number of times where enemies are added
var length = 5;

    // the game tick, from the start of the map
var tick = 0;
var enemyType;
var temp;
var howMany;

for (var i = 0 ; i < length ; i++)
    {
    tick += getRandomInt( 10, 50 );

    temp = getRandomInt( 0, ENEMY_TYPES.length - 1 );

    enemyType = ENEMY_TYPES[ temp ];
    howMany = getRandomInt( 1, 5 );

    map.push({
            tick: tick,
            enemyType: enemyType,
            howMany: howMany,
            x: -1,
            y: -1
        });
    }

return map;
};


/*
    Never ending maps
 */

RandomMaps.prototype.loadMap = function( mapNumber )
{
if ( typeof mapNumber == 'undefined' )
    {
    this.CURRENT_MAP++;
    }

else
    {
    this.CURRENT_MAP = mapNumber;
    }

var newMap = this.generateMap();

this.MAPS.push( newMap );

this.CURRENT_MAP_TICK = 0;
this.CURRENT_MAP_PHASE = 0;
this.NO_MORE_PHASES = false;

new Message( { text: 'Level ' + (this.CURRENT_MAP + 1), timeOut: 2000 } );
};




window.RandomMaps = RandomMaps;

}(window));