(function(window)
{
function RandomMaps( startingLevel )
{
    // the number of times a group of enemies is added
this.map_length = 5;

    // minimum/maximum number of enemies that can be spawned each time (is is increased as the maps are being cleared)
this.how_many_min = 1;
this.how_many_max = 5;

    // minimum/maximum number of ticks between each map phase
this.tick_min = 10;
this.tick_max = 50;

    // the damage/velocity of the enemies, it will be increased once and then to make the game more difficult
this.damage = 10;
this.velocity = 1;

    // inherit from the Maps class
Maps.call( this, { startingLevel: startingLevel } );
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
this.increaseDifficulty();

var map = [];

    // number of times where enemies are added
var length = this.map_length;

    // the game tick, from the start of the map
var tick = 0;
var enemyType;
var temp;
var howMany;

for (var i = 0 ; i < length ; i++)
    {
    tick += getRandomInt( this.tick_min, this.tick_max );

    temp = getRandomInt( 0, ENEMY_TYPES.length - 1 );

    enemyType = ENEMY_TYPES[ temp ];
    howMany = getRandomInt( this.how_many_min, this.how_many_max );

    map.push({
            tick      : tick,
            enemyType : enemyType,
            howMany   : howMany,
            x         : -1,
            y         : -1,
            damage    : this.damage,
            velocity  : this.velocity
        });
    }

return map;
};




RandomMaps.prototype.increaseDifficulty = function()
{
    // increase the difficulty every two levels (when the map number is even)
if ( ((this.CURRENT_MAP + 1) % 2) === 0 )
    {
    this.map_length++;
    this.how_many_max++;

    this.tick_max--;

    if ( this.tick_max < this.tick_min )
        {
        this.tick_max = this.tick_min;
        }

    this.damage++;
    }


    // every 5 levels
if ( ((this.CURRENT_MAP + 1) % 5) === 0 )
    {
    this.tick_min++;

    if ( this.tick_min > this.tick_max )
        {
        this.tick_min = this.tick_max;
        }

    this.velocity++;
    }
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

        // fill the MAPS with random stuff, until the position in the array matches the map number (that is assumed in the base class Maps)
        // for example when you restart the game, it starts again in the same level it was before
    if ( this.MAPS.length < mapNumber )
        {
        this.MAPS = new Array( mapNumber );
        }
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