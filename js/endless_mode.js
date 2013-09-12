(function(window)
{
/*
    Doesn't have levels/maps
    
    Difficulty increases with time
 */

function EndlessMode()
{
var endlessObject = this;

        // from how many ticks, until next enemy
this.NEXT_ENEMY_TICKS = 100;

    // number of ticks until we increase the difficulty
this.INCREASE_DIFFICULTY_TICKS = 500;

this.damage = 10;
this.velocity = 1;

    // the counters
this.COUNT_TICKS_NEXT_ENEMY = 0;
this.COUNT_TICKS_INCREASE_DIFFICULTY = 0;

initGame();

this.TICK_F = function()
    {
    endlessObject.tick();
    };

createjs.Ticker.addEventListener( 'tick', this.TICK_F );
}


/*
    Gets called after the main tick()
 */

EndlessMode.prototype.tick = function()
{
this.COUNT_TICKS_NEXT_ENEMY--;

if ( this.COUNT_TICKS_NEXT_ENEMY < 0 )
    {
    this.COUNT_TICKS_NEXT_ENEMY = this.NEXT_ENEMY_TICKS;
    

//    var enemy = ENEMY_TYPES[ getRandomInt( 0, ENEMY_TYPES.length - 1 ) ];
    var enemy = EnemyKamikaze;

    var x = getRandomInt( 0, GAME_WIDTH );
    var y = getRandomInt( 0, GAME_HEIGHT );

    new enemy( { x: x, y: y } );
    }

    

    // deal with increasing the difficulty of the game
this.COUNT_TICKS_INCREASE_DIFFICULTY--;


if ( this.COUNT_TICKS_INCREASE_DIFFICULTY < 0 )
    {
    this.COUNT_TICKS_INCREASE_DIFFICULTY = this.INCREASE_DIFFICULTY_TICKS;
    
        // increase the difficulty of the game
    /*$( ENEMY_TYPES ).each(function(index, enemyType)
        {
        enemyType.increaseDifficulty();
        });*/       //HERE

    
        // reduce the time it takes until a new enemy is added
    this.NEXT_ENEMY_TICKS--;
    }    
};



EndlessMode.prototype.clear = function()
{
createjs.Ticker.removeEventListener( 'tick', this.TICK_F );
};



window.EndlessMode = EndlessMode;

}(window));
