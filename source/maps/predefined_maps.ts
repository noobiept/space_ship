import Maps from "./maps";
import { PRELOAD } from "../main";
import { LevelInfo } from "../shared/types";

const NUMBER_OF_MAPS = 10;

// has the maps configurations
const MAPS: LevelInfo[] = [];

export default class PredefinedMaps extends Maps {
    constructor() {
        if (MAPS.length === 0) {
            for (let i = 0; i < NUMBER_OF_MAPS; i++) {
                const level = PRELOAD.getResult("level" + (i + 1)) as LevelInfo;
                MAPS.push(level);
            }
        }

        super({ maps: MAPS });
    }
}
