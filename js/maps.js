/*
    Ter um ficheiro .json para cada nivel
    
    No inicio inicializa os objectos
    
    Weapons:
        - que armas se pode usar
        - qts tiros comeca no inicio
        - a velocidade k os tiros adicionam
        
    Enemies:
        - a velocidade/damage
        
    Depois, ter o numero de ticks ate k algo aconteca, e o que acontece
    
        por exemplo
            {
                tick: 20,    // qd chegar a 20 executa isto
                enemies:
                    {
                    which: rotateAround,
                    positionX: ...,     //-1 means random
                    positionY:
                    }
            }
            
    
    Quando n houver + elementos no .json, termina o nivel
*/

(function(window)
{
    // has the levels configurations
var LEVELS = [];

var NUMBER_OF_LEVELS = 2;


var CURRENT_LEVEL = 0;


var COUNT_TICKS = 0;


var LEVEL_PHASE = 0;


var ENDING_LEVEL = false;



function Maps()
{
Maps.reset();

var level;
var filePath;

    // to determine the last map (so we can run some code then)
var countLoadedMaps = 0;

var i = 0;


for (i = 0 ; i < NUMBER_OF_LEVELS ; i++)
    {
    filePath = 'maps/level' + i + '.json';
   
    $.ajax({
        url: filePath, 
        dataType: 'json',
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
            
            countLoadedMaps++;
            
                // all loaded
            if (countLoadedMaps >= NUMBER_OF_LEVELS)
                {
                Maps.loadMap( 0 );
        
                createjs.Ticker.addListener( Maps.tick );
                }
            },
            
        error: function(jqXHR, textStatus, errorThrown)
            {
            console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }
}


/*
    Arguments:
    
        level (int) : which map/level to load (if not provided, load the next map)
 */

Maps.loadMap = function( level )
{
    // load next map
if (typeof level == 'undefined')
    {
    CURRENT_LEVEL++;
    }

else
    {
    CURRENT_LEVEL = 0;
    }

    // no more levels
if (CURRENT_LEVEL >= NUMBER_OF_LEVELS)
    {
    Maps.noMoreLevels();
    }

else
    {
    COUNT_TICKS = 0;
    LEVEL_PHASE = 0;
    ENDING_LEVEL = false;
    
    Maps.showMessage( "Level " + CURRENT_LEVEL, 2000 );
    }
};




Maps.reset = function()
{
COUNT_TICKS = 0;
LEVEL_PHASE = 0;
ENDING_LEVEL = false;
LEVELS.length = 0;
CURRENT_LEVEL = 0;
createjs.Ticker.removeListener( Maps.tick );
};




/*
    Shows a message in the middle of the canvas for a period of time
    
    Arguments:
    
        - text : the actual message
        - timeout : duration of the message (in miliseconds)
        - timeout_function : executes when the timeout ends (optional)
 */

Maps.showMessage = function( text, timeout, timeout_function )
{
var message = new createjs.Text(text, "30px Arial", "rgb(255, 255, 255)");

message.textAlign = 'center';

message.x = CANVAS.width / 2;
message.y = CANVAS.height / 2;

createjs.Tween.get( message ).to( { alpha: 0 }, 100, createjs.Ease.get( 1 ) );    //HERE doesnt work...

STAGE.addChild( message );


setTimeout( function() 
    {
    STAGE.removeChild( message ); 
    
    if (typeof timeout_function != 'undefined' && timeout_function != null)
        {
        timeout_function();
        }
    
    }, timeout );
};





/*
    All levels completed, show a message and then go to the MainMenu
 */

Maps.noMoreLevels = function()
{
Maps.reset();

Maps.showMessage("Congratulations, you finished the game!\nToo easy huh?", 4000, function() { MainMenu(); } );
};



Maps.tick = function()
{  
COUNT_TICKS++;

var currentLevel = LEVELS[ CURRENT_LEVEL ];
  
    
var phase = currentLevel[ LEVEL_PHASE ];



if ( !ENDING_LEVEL && COUNT_TICKS >= phase.tick)
    {   
    var enemyType = window[ phase.enemyType ];
    
    var i;
    var howMany = parseInt( phase.howMany );
    
    for (i = 0 ; i < howMany ; i++)
        {
        var enemy = new enemyType();
        
            // random x position
        if (phase.x < 0)
            {
            enemy.x = getRandomInt( 0, GAME_WIDTH );
            }
        
        else
            {
            enemy.x = phase.x;
            }
        
            // random y position
        if (phase.y < 0)
            {
            enemy.y = getRandomInt( 0, GAME_HEIGHT );
            }
        
        else
            {
            enemy.y = phase.y;
            }
        
        addNewEnemy( enemy );
        }
    

    
        // advance to the next phase of the level
    LEVEL_PHASE++;
    
        // no more phases of the level
        // game ends when there aren't more enemies
    if (LEVEL_PHASE >= currentLevel.length)
        {
        ENDING_LEVEL = true;
        
            // we're gonna count a bit more, before checking for the ENDING_LEVEL variable, to give time for the Enemies to spawn
        COUNT_TICKS = 0;
        }
    }

    
    // the level ended
if ( ENDING_LEVEL === true &&  COUNT_TICKS >= 100 && EnemyShip.all.length === 0 )
    {
    Maps.loadMap();
    }
};

Maps.LEVELS = LEVELS;


window.Maps = Maps;


}(window));