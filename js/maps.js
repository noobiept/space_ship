/*
    Ter um ficheiro .json para cada nivel
    
    No inicio inicializa os objectos
    
    Weapons:
        - que armas se pode usar
        - qts tiros comeca no inicio\
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


function Maps()
{
Maps.reset();

var level;
var filePath;

    // load all but the last one
for (var i = 0 ; i < NUMBER_OF_LEVELS - 1 ; i++)
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
            }
        });
    }

    
    // load the last one separately to add to the Ticker once everything is loaded
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
        
        Ticker.addListener( Maps.tick );
        }
    });
}


    // has the levels configurations
var LEVELS = [];

var NUMBER_OF_LEVELS = 1;


var CURRENT_LEVEL = 0;


var COUNT_TICKS = 0;


var LEVEL_PHASE = 0;


var ENDING_LEVEL = false;



Maps.reset = function()
{
COUNT_TICKS = 0;
LEVEL_PHASE = 0;
ENDING_LEVEL = false;
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
    if (LEVEL_PHASE + 1 >= currentLevel.length)
        {
        ENDING_LEVEL = true;
        
            // we're gonna count a bit more, before checking for the ENDING_LEVEL variable, to give time for the Enemies to spawn
        COUNT_TICKS = 0;
        }
    }

    
    // the level ended
if ( ENDING_LEVEL === true &&  COUNT_TICKS >= 100 && EnemyShip.all.length === 0 )
    {
    MainMenu(); //HERE for now
    }
};

Maps.LEVELS = LEVELS;


window.Maps = Maps;


}(window));