
(function(window)
{

    // from how many ticks, until next enemy
var NEXT_ENEMY_TICKS = 100;

var COUNT_TICKS_NEXT_ENEMY = 0;


    // number of ticks until we increase the difficulty 
var INCREASE_DIFFICULTY_TICKS = 500;
var COUNT_INCREASE_DIFFICULTY_TICKS = 0;




/*
    Doesn't have levels/maps
    
    Difficulty increases with time
 */

function EndlessMode()
{
GAME_MODE = EndlessMode;

initGame();
}





/*
    Gets called after the main tick()
 */

EndlessMode.tick = function()
{
COUNT_TICKS_NEXT_ENEMY--;

if (COUNT_TICKS_NEXT_ENEMY < 0)
    {
    COUNT_TICKS_NEXT_ENEMY = NEXT_ENEMY_TICKS;
    
  
    //var enemy = new ENEMY_TYPES[ getRandomInt(0, ENEMY_TYPES.length - 1 ) ]();
    var enemy = new EnemyMoveHorizontally();
    //var enemy = new EnemyRocks();
    //var enemy = new EnemyRotateAround();

    var x = getRandomInt( 0, GAME_WIDTH );
    var y = getRandomInt( 0, GAME_HEIGHT );
    
   


    enemy.moveTo( x, y );

    addNewEnemy( enemy );
    }

    

    // deal with increasing the difficulty of the game
COUNT_INCREASE_DIFFICULTY_TICKS--;

if (COUNT_INCREASE_DIFFICULTY_TICKS < 0)
    {
    COUNT_INCREASE_DIFFICULTY_TICKS = INCREASE_DIFFICULTY_TICKS;
    
        // increase the difficulty of the game
    $( ENEMY_TYPES ).each(function(index, enemyType)
        {
        enemyType.increaseDifficulty();
        });
    
        // reduce the time it takes until a new enemy is added
    NEXT_ENEMY_TICKS--;
    }    
};


window.EndlessMode = EndlessMode;

}(window));
