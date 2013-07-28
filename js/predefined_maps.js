(function(window)
{
function PredefinedMaps()
{

}

    // has the levels configurations
var LEVELS = [];

var NUMBER_OF_LEVELS = 2;


var CURRENT_LEVEL = 0;


var COUNT_TICKS = 0;


var LEVEL_PHASE = 0;


var ENDING_LEVEL = false;


PredefinedMaps.init = function()
{
var level;
var filePath;


for (var i = 0 ; i < NUMBER_OF_LEVELS ; i++)
    {
    filePath = 'maps/level' + i + '.json';

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
            LEVELS.push( data );
            },

        error: function(jqXHR, textStatus, errorThrown)
            {
            console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }
};


PredefinedMaps.start = function()
{
GAME_MODE = PredefinedMaps;

initGame();

PredefinedMaps.reset();
PredefinedMaps.loadMap( 0 );

createjs.Ticker.addEventListener( 'tick', PredefinedMaps.tick );
};




/*
    Arguments:

        level (int) : which map/level to load (if not provided, load the next map)
 */

PredefinedMaps.loadMap = function( level )
{
    // load next map
if (typeof level == 'undefined')
    {
    CURRENT_LEVEL++;
    }

else
    {
    CURRENT_LEVEL = level;
    }

    // no more levels
if (CURRENT_LEVEL >= NUMBER_OF_LEVELS)
    {
    PredefinedMaps.noMoreLevels();
    }

else
    {
    COUNT_TICKS = 0;
    LEVEL_PHASE = 0;
    ENDING_LEVEL = false;

    new Message( { text: 'Level ' + (CURRENT_LEVEL + 1), timeOut: 2000 } );
    }
};




PredefinedMaps.reset = function()
{
createjs.Ticker.removeEventListener( 'tick', PredefinedMaps.tick );
COUNT_TICKS = 0;
LEVEL_PHASE = 0;
ENDING_LEVEL = false;
CURRENT_LEVEL = 0;
};




/*
    All levels completed, show a message and then go to the MainMenu
 */

PredefinedMaps.noMoreLevels = function()
{
PredefinedMaps.reset();


new Message({
    text: "Congratulations, you finished the game!<br />Too easy huh?",
    timeOut: 4000,
    timeOut_f: function() { MainMenu.open() }
    });
};



PredefinedMaps.tick = function()
{
COUNT_TICKS++;

var currentLevel = LEVELS[ CURRENT_LEVEL ];

var phase = currentLevel[ LEVEL_PHASE ];



if ( !ENDING_LEVEL && COUNT_TICKS >= phase.tick )
    {
    var enemyType = window[ phase.enemyType ];

    var i;
    var howMany = parseInt( phase.howMany );

    var x, y;

    for (i = 0 ; i < howMany ; i++)
        {
            // random x position
        if (phase.x < 0)
            {
            x = getRandomInt( 0, GAME_WIDTH );
            }

        else
            {
            x = phase.x;
            }

            // random y position
        if (phase.y < 0)
            {
            y = getRandomInt( 0, GAME_HEIGHT );
            }

        else
            {
            y = phase.y;
            }

        new enemyType( x, y );
        }


        // advance to the next phase of the level
    LEVEL_PHASE++;

        // no more phases of the level
        // game ends when there aren't more enemies
    if (LEVEL_PHASE >= currentLevel.length)
        {
        ENDING_LEVEL = true;
        }
    }


    // the level ended
if ( ENDING_LEVEL === true && EnemyShip.all.length === 0 && EnemyShip.all_spawning.length === 0 )
    {
    PredefinedMaps.loadMap();
    }
};


window.PredefinedMaps = PredefinedMaps;

}(window));