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

for (var i = 0 ; i < NUMBER_OF_LEVELS ; i++)
    {
    filePath = 'maps/level' + i + '.json';
   
    $.ajax(filePath , function(data)
        {
        LEVELS.push( JSON.parse( data ) );
        });
    }
}


    // has the levels configurations
var LEVELS = [];

var NUMBER_OF_LEVELS = 1;


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

var phase = LEVELS[ LEVEL_PHASE ];

if ( !ENDING_LEVEL && COUNT_TICKS >= phase.tick)
    {
    var enemyType = window[ phase.enemyType ];
    
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
    
        // advance to the next phase of the level
    LEVEL_PHASE++;
    
        // game ends when there aren't more enemies
    if (LEVEL_PHASE + 1 >= NUMBER_OF_LEVELS)
        {
        ENDING_LEVEL = true;
        }
    }

    
    // the level ended
if ( ENDING_LEVEL === true && EnemyShip.all.length === 0 )
    {
    MainMenu(); //HERE for now
    }
};


}(window));