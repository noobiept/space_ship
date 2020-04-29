import { getRandomInt } from "@drk4/utilities";

import * as MainMenu from "../menus/main_menu";
import * as Canvas from "../game/canvas";
import { initGame, MAIN_SHIP, nextSong } from "../main";
import Message from "../shared/message";
import EnemyShip from "../enemies/enemy_ship";
import { MapType, LevelInfo, LevelInfoPhase } from "../shared/types";
import { EnemyMapping } from "../shared/constants";

export type MapsArgs = {
    maps?: LevelInfo[];
};

export default class Maps implements MapType {
    CURRENT_MAP: number;

    private NUMBER_OF_MAPS: number;
    protected MAPS: LevelInfo[];
    protected CURRENT_MAP_TICK: number;
    protected CURRENT_MAP_PHASE: number;
    protected NO_MORE_PHASES: boolean;

    constructor(args: MapsArgs = {}) {
        if (typeof args.maps == "undefined") {
            // number of maps in the game, -1 if no limit (for the RandomMaps mode)
            this.NUMBER_OF_MAPS = -1;

            // has the map configuration (what enemies to add, at what tick, etc)
            this.MAPS = [];
        }

        // the maps can be provided
        else {
            this.MAPS = args.maps;
            this.NUMBER_OF_MAPS = args.maps.length;
        }

        // the current position in the MAPS array above, which represents the current map being played
        this.CURRENT_MAP = 0;

        // counts the game ticks since the map started (so, its reset every time a new map starts
        this.CURRENT_MAP_TICK = 0;

        // the position in the map array (we have an array for all the maps, and each map is also an array with the timings, this one is for the map timings)
        this.CURRENT_MAP_PHASE = 0;

        // tells whether there are still more phases in the current map, or if the game ends once all the current enemies are dealt with
        this.NO_MORE_PHASES = false;

        // start the game
        initGame();
    }

    /*
     * `mapNumber`: which map/level to load (if not provided, load the next map).
     */
    loadMap(mapNumber?: number) {
        // load the next map
        if (typeof mapNumber == "undefined") {
            this.CURRENT_MAP++;
        } else {
            this.CURRENT_MAP = mapNumber;
        }

        // no more maps
        if (
            this.NUMBER_OF_MAPS > 0 &&
            this.CURRENT_MAP >= this.NUMBER_OF_MAPS
        ) {
            this.noMoreLevels();
        }

        // load the next map
        else {
            this.CURRENT_MAP_TICK = 0;
            this.CURRENT_MAP_PHASE = 0;
            this.NO_MORE_PHASES = false;

            new Message({
                text: "Level " + (this.CURRENT_MAP + 1),
                timeOut: 2000,
            });
        }
    }

    /*
     * All levels completed, show a message and then go to the MainMenu.
     */
    noMoreLevels() {
        new Message({
            text: "Congratulations, you finished the game!<br />Too easy huh?",
            timeOut: 4000,
            onTimeout: function () {
                MainMenu.open();
            },
        });
    }

    addEnemiesInPhase(map: LevelInfo, phase: LevelInfoPhase) {
        // get the enemy type
        const enemyType = EnemyMapping[phase.enemyType];

        // other information
        const howMany = phase.howMany;
        const damage = map.damage[phase.enemyType];
        const velocity = map.velocity[phase.enemyType];
        const { width, height } = Canvas.getDimensions();

        // get the x/y and create the enemy
        for (let i = 0; i < howMany; i++) {
            const x = getRandomInt(0, width);
            const y = getRandomInt(0, height);

            new enemyType({
                x: x,
                y: y,
                damage: damage,
                velocity: velocity,
            });
        }
    }

    tick(event: createjs.TickerEvent) {
        if (event.paused) {
            return;
        }

        const currentMap = this.MAPS[this.CURRENT_MAP];

        if (!currentMap) {
            return;
        }

        this.CURRENT_MAP_TICK++;

        const phase = currentMap.map[this.CURRENT_MAP_PHASE];

        if (!this.NO_MORE_PHASES && this.CURRENT_MAP_TICK >= phase.tick) {
            this.addEnemiesInPhase(currentMap, phase);

            // advance to the next phase of the map
            this.CURRENT_MAP_PHASE++;

            // no more phases of the map
            // game ends when there aren't more enemies
            if (this.CURRENT_MAP_PHASE >= currentMap.map.length) {
                this.NO_MORE_PHASES = true;
            }
        }

        // the map ended
        if (
            this.NO_MORE_PHASES === true &&
            EnemyShip.all.length === 0 &&
            EnemyShip.all_spawning.length === 0
        ) {
            this.loadMap();
            nextSong();

            MAIN_SHIP.refreshAmmo();
        }
    }
}
