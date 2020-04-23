import Maps from "./maps";
import { LevelInfo } from "../shared/types";
import { getAsset } from "../shared/assets";

const NUMBER_OF_MAPS = 10;

// has the maps configurations
const MAPS: LevelInfo[] = [];

export default class PredefinedMaps extends Maps {
    constructor() {
        if (MAPS.length === 0) {
            for (let i = 0; i < NUMBER_OF_MAPS; i++) {
                const level = getAsset("level" + (i + 1)) as LevelInfo;
                MAPS.push(level);
            }
        }

        super({ maps: MAPS });
    }
}
