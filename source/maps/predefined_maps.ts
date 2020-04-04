import Maps from "./maps";
import { PRELOAD } from "../main";

var NUMBER_OF_MAPS = 10;

// has the maps configurations
var MAPS = [];

export default class PredefinedMaps extends Maps {
    constructor() {
        if (MAPS.length == 0) {
            for (var i = 0; i < NUMBER_OF_MAPS; i++) {
                MAPS.push(PRELOAD.getResult("level" + (i + 1)));
            }
        }

        super({ maps: MAPS });
    }
}
