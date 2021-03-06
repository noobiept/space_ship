import { getRandomInt } from "@drk4/utilities";
import Maps from "./maps";
import Message from "../shared/message";
import { getRandomEnemy } from "../shared/utilities";
import { EnemyNames } from "../shared/constants";
import { LevelInfo, LevelInfoDamage, LevelInfoVelocity } from "../shared/types";

export default class RandomMaps extends Maps {
    private map_length: number;
    private how_many_min: number;
    private how_many_max: number;
    private tick_min: number;
    private tick_max: number;
    private damage: number;
    private velocity: number;

    constructor() {
        super();

        // the number of times a group of enemies is added
        this.map_length = 6;

        // minimum/maximum number of enemies that can be spawned each time (is is increased as the maps are being cleared)
        this.how_many_min = 2;
        this.how_many_max = 6;

        // minimum/maximum number of ticks between each map phase
        this.tick_min = 10;
        this.tick_max = 50;

        // the damage/velocity of the enemies, it will be increased once and then to make the game more difficult
        this.damage = 10;
        this.velocity = 5;
    }

    /**
     * Generates a map in a similar format as the one used in PredefinedMaps
     *
     * Differences:
     *   - the EnemyType is the class reference here, while in the PredefinedMaps is a string
     */
    generateMap(): LevelInfo {
        this.increaseDifficulty();

        const map = [];

        // number of times where enemies are added
        const length = this.map_length;

        // the game tick, from the start of the map
        let tick = 0;

        for (let i = 0; i < length; i++) {
            tick += getRandomInt(this.tick_min, this.tick_max);

            const howMany = getRandomInt(this.how_many_min, this.how_many_max);
            const enemy = getRandomEnemy();

            map.push({
                tick: tick,
                enemyType: enemy.name,
                howMany: howMany,
            });
        }

        const damage = EnemyNames.reduce(
            (acc, name) => ({ ...acc, [name]: this.damage }),
            {} as LevelInfoDamage
        );
        const velocity = EnemyNames.reduce(
            (acc, name) => ({ ...acc, [name]: this.velocity }),
            {} as LevelInfoVelocity
        );

        return {
            damage,
            velocity,
            map,
        };
    }

    increaseDifficulty() {
        // increase the difficulty every two levels (when the map number is even)
        if ((this.CURRENT_MAP + 1) % 2 === 0) {
            this.map_length++;
            this.how_many_max++;

            this.tick_max--;

            if (this.tick_max < this.tick_min) {
                this.tick_max = this.tick_min;
            }

            this.damage++;
        }

        // every 5 levels
        if ((this.CURRENT_MAP + 1) % 4 === 0) {
            this.tick_min++;

            if (this.tick_min > this.tick_max) {
                this.tick_min = this.tick_max;
            }

            this.velocity++;
        }
    }

    /*
     * Never ending maps.
     */
    loadMap(mapNumber?: number) {
        if (typeof mapNumber == "undefined") {
            this.CURRENT_MAP++;
        } else {
            this.CURRENT_MAP = mapNumber;

            // fill the MAPS with random stuff, until the position in the array matches the map number (that is assumed in the base class Maps)
            // for example when you restart the game, it starts again in the same level it was before
            if (this.MAPS.length < mapNumber) {
                this.MAPS = new Array(mapNumber);
            }
        }

        const newMap = this.generateMap();

        this.MAPS.push(newMap);

        this.CURRENT_MAP_TICK = 0;
        this.CURRENT_MAP_PHASE = 0;
        this.NO_MORE_PHASES = false;

        new Message({ text: "Level " + (this.CURRENT_MAP + 1), timeOut: 2000 });
    }
}
