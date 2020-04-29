import * as Options from "./shared/options";
import * as GameStatistics from "./menus/game_statistics";
import * as ZIndex from "./game/z_index";
import * as MainMenu from "./menus/main_menu";
import * as AppStorage from "./app_storage";
import * as GameMenu from "./menus/game_menu";
import * as Assets from "./shared/assets";
import * as Canvas from "./game/canvas";
import Message from "./shared/message";
import Music from "./game/music";
import Ship from "./game/ship";
import {
    handleKeyDown,
    handleKeyUp,
    clearKeysHeld,
    gameOverShortcuts,
} from "./keyboard_events";
import EnemyShip from "./enemies/enemy_ship";
import Bullet from "./bullets/bullet";
import { MapType, AppData, MapTypeClass } from "./shared/types";
import { hideElement, showElement } from "./shared/utilities";
import * as CollisionDetection from "./game/collision_detection";
import World from "./game/world";
import { b2ContactListener } from "./shared/constants";

const DEBUG = false;

const MUSIC = new Music({
    songIDs: ["Audio-music1", "Audio-music2"],
});

export let STAGE: createjs.Stage;
export const WORLD = new World();
export let MAIN_SHIP: Ship;

let MAP_MODE: MapTypeClass | null = null;
let GAME_OBJECT: MapType | null = null;

window.onload = function () {
    AppStorage.getData(["space_ship_options"], initApp);
};

function initApp(data: AppData) {
    Options.load(data["space_ship_options"]);
    MainMenu.init();
    GameMenu.init();

    const canvas = Canvas.init(DEBUG);

    // create a stage object to work with the canvas. This is the top level node in the display list
    STAGE = new createjs.Stage(canvas);

    createjs.Ticker.interval = 50;

    const loading = new Message({ text: "Loading", centerWindow: true });

    Assets.init({
        onComplete: () => {
            loading.remove();
            MainMenu.open();
        },
        onLoading: (progress) => {
            loading.setText("Loading " + progress + "%");
        },
    });
}

export function initGame() {
    resetStuff();

    GameStatistics.start(STAGE);

    MAIN_SHIP = new Ship();
    MAIN_SHIP.addEventListener("dead", () => {
        gameOver(MAIN_SHIP);
    });

    // so that .tick() of EnemyShip/Ship/... is called automatically
    createjs.Ticker.on("tick", tick as (event: any) => void);

    // call update on the stage to make it render the current display list to the canvas
    STAGE.update();

    // set up collision detection
    const listener = new b2ContactListener();
    listener.BeginContact = CollisionDetection.onContact;

    WORLD.setContactListener(listener);

    // register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp((position) =>
        MAIN_SHIP.selectWeapon(position)
    );

    MUSIC.play(0);
    GameMenu.reset();
}

/**
 * Game ended, show a message and then restart the game.
 */
function gameOver(ship: Ship) {
    ship.remove();

    createjs.Ticker.removeAllEventListeners();
    window.onclick = null; // so that you can't fire anymore

    const endMessage = new Message({
        text: "Game Over: Press enter to restart",
    });

    document.onkeyup = gameOverShortcuts(() => {
        endMessage.remove();
        startGameMode(true);
    });
}

/**
 * Start a new game on the same map mode.
 */
export function startGameMode(fromPreviousLevel?: boolean) {
    if (typeof fromPreviousLevel == "undefined") {
        fromPreviousLevel = false;
    }

    let startingLevel = 0;

    if (GAME_OBJECT) {
        if (fromPreviousLevel) {
            startingLevel = GAME_OBJECT.CURRENT_MAP;
        }
    }

    resetStuff();

    Canvas.showCanvas();
    GAME_OBJECT = new MAP_MODE!();
    GAME_OBJECT.loadMap?.(startingLevel);
}

export function pause() {
    MAIN_SHIP.setDisabled(true);
    createjs.Ticker.paused = true;
}

export function resume() {
    MAIN_SHIP.setDisabled(false);
    createjs.Ticker.paused = false;
}

export function setMapMode(mode: MapTypeClass) {
    MAP_MODE = mode;
}

/*
 * Resets the configurations (for when restarting the game).
 */
export function resetStuff() {
    STAGE.removeAllChildren();
    createjs.Ticker.removeAllEventListeners();

    MUSIC.stop();
    ZIndex.clear();

    EnemyShip.removeAll();
    Bullet.removeAllBullets();
    Ship.removeAll();

    clearKeysHeld();
    Message.removeAll();

    hideElement("GameMenu");

    CollisionDetection.reset();
    createjs.Ticker.paused = false;

    WORLD.drawDebugData();
    STAGE.update();
}

function tick(event: createjs.TickerEvent) {
    if (event.paused) {
        return;
    }

    CollisionDetection.tick();
    Bullet.cleanAll();

    // call the ticks of the ships/bullets/etc
    for (let a = Ship.all.length - 1; a >= 0; a--) {
        Ship.all[a].tick();
    }

    for (let a = EnemyShip.all.length - 1; a >= 0; a--) {
        EnemyShip.all[a].tick(event);
    }

    for (let a = EnemyShip.all_spawning.length - 1; a >= 0; a--) {
        EnemyShip.all_spawning[a].tick(event);
    }

    for (let a = Bullet.all_bullets.length - 1; a >= 0; a--) {
        Bullet.all_bullets[a].tick(event);
    }

    GAME_OBJECT!.tick(event);
    WORLD.tick();
    STAGE.update();
}

/**
 * Start playing the next song.
 */
export function nextSong() {
    MUSIC.next();
}
