import { Preload } from "@drk4/utilities";

let PRELOAD: Preload;

export type AssetsArgs = {
    onLoading: (progress: number) => void;
    onComplete: () => void;
};

export function init({ onComplete, onLoading }: AssetsArgs) {
    PRELOAD = new Preload();

    const manifest = [
        { id: "level1", path: "maps/level1.json" },
        { id: "level2", path: "maps/level2.json" },
        { id: "level3", path: "maps/level3.json" },
        { id: "level4", path: "maps/level4.json" },
        { id: "level6", path: "maps/level6.json" },
        { id: "level5", path: "maps/level5.json" },
        { id: "level7", path: "maps/level7.json" },
        { id: "level8", path: "maps/level8.json" },
        { id: "level9", path: "maps/level9.json" },
        { id: "level10", path: "maps/level10.json" },

        {
            id: "enemy_move_horizontally",
            path: "images/enemy_move_horizontally.png",
        },
        { id: "enemy_rocks", path: "images/enemy_rocks.png" },
        {
            id: "enemy_rotate_around",
            path: "images/enemy_rotate_around.png",
        },
        { id: "enemy_kamikaze", path: "images/enemy_kamikaze.png" },
        { id: "ship", path: "images/ship.png" },
    ];

    PRELOAD.addEventListener("progress", onLoading);
    PRELOAD.addEventListener("complete", onComplete);
    PRELOAD.loadManifest(manifest);
}

/**
 * Get a previously loaded asset.
 */
export function getAsset(id: string) {
    return PRELOAD.get(id);
}
