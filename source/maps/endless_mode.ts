import { getRandomInt } from "@drk4/utilities";
import { initGame, GAME_WIDTH, GAME_HEIGHT } from "../main";
import { MapType } from "../shared/types";
import { getRandomEnemy } from "../shared/utilities";

/*
    Doesn't have levels/maps

    Difficulty increases with time
 */
export default class EndlessMode implements MapType {
    CURRENT_MAP = 0;

    private next_enemy: number;
    private damage: number;
    private velocity: number;
    private decrease_next_enemy_step: number;
    private increase_damage_step: number;
    private increase_velocity_step: number;
    private count_next_enemy: number;
    private count_decrease_next_enemy: number;
    private count_increase_damage: number;
    private count_increase_velocity: number;

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

            const enemy = getRandomEnemy();
            const numberOfEnemies = 3;

            for (var i = 0; i < numberOfEnemies; i++) {
                const x = getRandomInt(0, GAME_WIDTH);
                const y = getRandomInt(0, GAME_HEIGHT);

                new enemy.class({
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
