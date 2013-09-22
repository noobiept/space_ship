/*
    Base class for PredefinedMaps and RandomMaps
 */

(function(window)
{
/*
    args has:
        .maps           (optional)
        .startingLevel  (optional)

        .maps = {
            "damage":   // globally sets the damage/velocity of a certain type of enemy. it can be overridden in the individual tick in the "map"
                {
                    "EnemyMoveHorizontally": 10,
                    "EnemyKamikaze": 5,
                    ...
                },
            "velocity":
                {
                    "EnemyMoveHorizontally": 4,
                    ...
                },
            "map":  // a list of the ticks, where we add enemies, counting from the start of the map
                [
                    {
                        "tick": 0,
                        "enemyType": "EnemyMoveHorizontally",
                        "howMany": 10,
                        "x": 100,       (optional, if not provided or if its less than zero then its randomized)
                        "y": 100,       (optional, same as with "x")
                        "damage": 15,   (optional, if not provided it uses the global value)
                        "velocity": 6   (optional, same as with "damage")
                    },
                    ...
                ]
        }
 */

function Maps( args )
{
var mapObject = this;

if ( typeof args.maps == 'undefined' )
    {
        // number of maps in the game, -1 if no limit (for the RandomMaps mode)
    this.NUMBER_OF_MAPS = -1;

        // has the map configuration (what enemies to add, at what tick, etc)
    this.MAPS = [];
    }

    // the maps can be provided
else
    {
    this.MAPS = args.maps;

    this.NUMBER_OF_MAPS = args.maps.length;
    }


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


var startingLevel = 0;

if ( typeof args.startingLevel != 'undefined' )
    {
    startingLevel = args.startingLevel;
    }

this.loadMap( startingLevel );


    // adding the mapObject directly in the addEventListener wasn't working so...
this.TICK_F = function( event )
    {
    mapObject.tick( event );
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
    this.CURRENT_MAP = mapNumber;
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




Maps.prototype.tick = function( event )
{
if ( event.paused )
    {
    return;
    }

this.CURRENT_MAP_TICK++;

var currentMap = this.MAPS[ this.CURRENT_MAP ];

var phase = currentMap.map[ this.CURRENT_MAP_PHASE ];


if ( !this.NO_MORE_PHASES && this.CURRENT_MAP_TICK >= phase.tick )
    {
        // get the enemy type
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


        // other information
    var howMany = parseInt( phase.howMany );

    var damage;

        // see if there's a specific damage set for this type
    if ( phase.damage )
        {
        damage = parseInt( phase.damage );
        }

        // otherwise use the global value
    else
        {
        damage = parseInt( currentMap.damage[ phase.enemyType.toString() ] );
        }


    var velocity;

        // again like with the damage, the value in the map has precedence
    if ( phase.velocity )
        {
        velocity = parseInt( phase.velocity );
        }

        // otherwise we use the global value
    else
        {
        velocity = parseInt( currentMap.velocity[ phase.enemyType.toString() ] );
        }


        // get the x/y and create the enemy
    var x, y;

    for (var i = 0 ; i < howMany ; i++)
        {
            // random x position
        if ( !phase.x || phase.x < 0 )
            {
            x = getRandomInt( 0, GAME_WIDTH );
            }

        else
            {
            x = phase.x;
            }

            // random y position
        if ( !phase.y || phase.y < 0 )
            {
            y = getRandomInt( 0, GAME_HEIGHT );
            }

        else
            {
            y = phase.y;
            }

        new enemyType( { x: x, y: y, damage: damage, velocity: velocity } );
        }


        // advance to the next phase of the map
    this.CURRENT_MAP_PHASE++;

        // no more phases of the map
        // game ends when there aren't more enemies
    if ( this.CURRENT_MAP_PHASE >= currentMap.map.length )
        {
        this.NO_MORE_PHASES = true;
        }
    }


    // the map ended
if ( this.NO_MORE_PHASES === true && EnemyShip.all.length === 0 && EnemyShip.all_spawning.length === 0 )
    {
    this.loadMap();

    Music.next();

    MAIN_SHIP.refreshAmmo();
    }
};

window.Maps = Maps;

}(window));
