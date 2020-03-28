/*global initGame, ENEMY_TYPES, getRandomInt, GAME_WIDTH, GAME_HEIGHT*/

(function(window)
{
/*
    Doesn't have levels/maps

    Difficulty increases with time
 */

function EndlessMode()
{
    // from how many ticks, until next enemy (the step)
this.next_enemy = 50;

    // the current damage/velocity of the enemies
this.damage = 10;
this.velocity = 5;


    // number of ticks until we decrease the 'next_enemy_ticks'
this.decrease_next_enemy_step = 100;

    // number of ticks until we increase the 'damage' of the enemies
this.increase_damage_step = 300;

    // number of ticks until we increase the 'velocity' of the enemies
this.increase_velocity_step = 400;


    // the counters
this.count_next_enemy = 0;
this.count_decrease_next_enemy = 0;
this.count_increase_damage = 0;
this.count_increase_velocity = 0;

initGame();
}


/*
    Gets called after the main tick()
 */

EndlessMode.prototype.tick = function( event )
{
if ( event.paused )
    {
    return;
    }

this.count_next_enemy++;
this.count_decrease_next_enemy++;
this.count_increase_damage++;
this.count_increase_velocity++;


if ( this.count_next_enemy >= this.next_enemy )
    {
    this.count_next_enemy = 0;


    var enemy = ENEMY_TYPES[ getRandomInt( 0, ENEMY_TYPES.length - 1 ) ];


    var numberOfEnemies = 3;
    var x, y;

    for ( var i = 0 ; i < numberOfEnemies ; i++ )
        {
        x = getRandomInt( 0, GAME_WIDTH );
        y = getRandomInt( 0, GAME_HEIGHT );

        new enemy(
            {
                x        : x,
                y        : y,
                damage   : this.damage,
                velocity : this.velocity
            });
        }
    }



if ( this.count_decrease_next_enemy >= this.decrease_next_enemy_step )
    {
    this.count_decrease_next_enemy = 0;

    if ( this.next_enemy > 1 )
        {
        this.next_enemy--;
        }
    }


if ( this.count_increase_damage >= this.increase_damage_step )
    {
    this.count_increase_damage = 0;

    this.damage++;
    }


if ( this.count_increase_velocity >= this.increase_velocity_step )
    {
    this.count_increase_velocity = 0;

    this.velocity++;
    }
};



window.EndlessMode = EndlessMode;

}(window));