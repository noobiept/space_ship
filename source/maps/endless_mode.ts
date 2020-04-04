import { getRandomInt } from "@drk4/utilities";
import { initGame, ENEMY_TYPES, GAME_WIDTH, GAME_HEIGHT } from "../main";
import { MapType } from "../shared/types";

/*
    Doesn't have levels/maps

    Difficulty increases with time
 */
export default class EndlessMode implements MapType {
    next_enemy: number;
    damage: number;
    velocity: number;
    decrease_next_enemy_step: number;
    increase_damage_step: number;
    increase_velocity_step: number;
    count_next_enemy: number;
    count_decrease_next_enemy: number;
    count_increase_damage: number;
    count_increase_velocity: number;

    constructor() {
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

    tick(event: createjs.TickerEvent) {
        if (event.paused) {
            return;
        }

        this.count_next_enemy++;
        this.count_decrease_next_enemy++;
        this.count_increase_damage++;
        this.count_increase_velocity++;

        if (this.count_next_enemy >= this.next_enemy) {
            this.count_next_enemy = 0;

            var enemy = ENEMY_TYPES[getRandomInt(0, ENEMY_TYPES.length - 1)];

            var numberOfEnemies = 3;
            var x, y;

            for (var i = 0; i < numberOfEnemies; i++) {
                x = getRandomInt(0, GAME_WIDTH);
                y = getRandomInt(0, GAME_HEIGHT);

                new enemy({
                    x: x,
                    y: y,
                    damage: this.damage,
                    velocity: this.velocity,
                });
            }
        }

        if (this.count_decrease_next_enemy >= this.decrease_next_enemy_step) {
            this.count_decrease_next_enemy = 0;

            if (this.next_enemy > 1) {
                this.next_enemy--;
            }
        }

        if (this.count_increase_damage >= this.increase_damage_step) {
            this.count_increase_damage = 0;

            this.damage++;
        }

        if (this.count_increase_velocity >= this.increase_velocity_step) {
            this.count_increase_velocity = 0;

            this.velocity++;
        }
    }
}
