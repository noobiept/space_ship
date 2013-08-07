/*
    Base class for PredefinedMaps and RandomMaps
 */

(function(window)
{
function Maps()
{
var mapObject = this;

    // has the map configuration (what enemies to add, at what tick, etc)
this.MAPS = [];

    // number of maps in the game, -1 if no limit (for the RandomMaps mode)
this.NUMBER_OF_MAPS = -1;

    // the current position in the MAPS array above, which represents the current map being played
this.CURRENT_MAP = 0;

    // counts the game ticks since the map started (so, its reset every time a new map starts
this.CURRENT_MAP_TICK = 0;

    // the position in the map array (we have an array for all the maps, and each map is also an array with the timings, this one is for the map timings)
this.CURRENT_MAP_PHASE = 0;

    // tells whether there are still more phases in the current map, or if the game ends once all the current enemies are dealt with
this.NO_MORE_PHASES = false;


    // start the game
initGame();

this.loadMap( 0 );


    // adding the mapObject directly in the addEventListener wasn't working so...
this.TICK_F = function()
    {
    mapObject.tick();
    };

createjs.Ticker.addEventListener( 'tick', this.TICK_F );
}



/*
    Arguments:

        level (int) : which map/level to load (if not provided, load the next map)
 */

Maps.prototype.loadMap = function( mapNumber )
{
    // load the next map
if ( typeof mapNumber == 'undefined' )
    {
    this.CURRENT_MAP++;
    }

else
    {
    self.CURRENT_MAP = mapNumber;
    }


    // no more maps
if ( this.NUMBER_OF_MAPS > 0 && this.CURRENT_MAP >= this.NUMBER_OF_MAPS )
    {
    this.noMoreLevels();
    }

    // load the next map
else
    {
    this.CURRENT_MAP_TICK = 0;
    this.CURRENT_MAP_PHASE = 0;
    this.NO_MORE_PHASES = false;

    new Message( { text: 'Level ' + (this.CURRENT_MAP + 1), timeOut: 2000 } );
    }
};


/*
    All levels completed, show a message and then go to the MainMenu
 */

Maps.prototype.noMoreLevels = function()
{
this.clear();

new Message({
    text: "Congratulations, you finished the game!<br />Too easy huh?",
    timeOut: 4000,
    timeOut_f: function() { MainMenu.open() }
    });
};


Maps.prototype.clear = function()
{
createjs.Ticker.removeEventListener( 'tick', this.TICK_F );
};




Maps.prototype.tick = function()
{
this.CURRENT_MAP_TICK++;

var currentMap = this.MAPS[ this.CURRENT_MAP ];

var phase = currentMap[ this.CURRENT_MAP_PHASE ];


if ( !this.NO_MORE_PHASES && this.CURRENT_MAP_TICK >= phase.tick )
    {
    var enemyType;

    if ( $.type( phase.enemyType ) == 'string' )
        {
            // get the variable/reference from a string (the class, for example a reference to EnemyKamikaze)
        enemyType = window[ phase.enemyType ];
        }

    else
        {
            // its already a reference
        enemyType = phase.enemyType;
        }


    var howMany = parseInt( phase.howMany );

    var x, y;

    for (var i = 0 ; i < howMany ; i++)
        {
            // random x position
        if ( phase.x < 0 )
            {
            x = getRandomInt( 0, GAME_WIDTH );
            }

        else
            {
            x = phase.x;
            }

            // random y position
        if ( phase.y < 0 )
            {
            y = getRandomInt( 0, GAME_HEIGHT );
            }

        else
            {
            y = phase.y;
            }

        new enemyType( x, y );
        }


        // advance to the next phase of the map
    this.CURRENT_MAP_PHASE++;

        // no more phases of the map
        // game ends when there aren't more enemies
    if ( this.CURRENT_MAP_PHASE >= currentMap.length )
        {
        this.NO_MORE_PHASES = true;
        }
    }


    // the map ended
if ( this.NO_MORE_PHASES === true && EnemyShip.all.length === 0 && EnemyShip.all_spawning.length === 0 )
    {
    this.loadMap();
    }
};

window.Maps = Maps;

}(window));