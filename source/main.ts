import * as Options from "./shared/options";
import * as GameStatistics from "./menus/game_statistics";
import * as ZIndex from "./game/z_index";
import * as MainMenu from "./menus/main_menu";
import * as AppStorage from "./app_storage";
import * as GameMenu from "./menus/game_menu";
import * as Assets from "./shared/assets";
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
import { hideElement, showElement, centerCanvas } from "./shared/utilities";
import * as CollisionDetection from "./game/collision_detection";
import World from "./game/world";
import { b2DebugDraw, b2ContactListener, SCALE } from "./shared/constants";

// global variables

export let CANVAS: HTMLCanvasElement;
let CANVAS_DEBUG;

const DEBUG = false;

const MUSIC = new Music({
    songIDs: ["Audio-music1", "Audio-music2"],
});

// createjs
export let STAGE: createjs.Stage;

// box2d physics
export const WORLD = new World();

// playable dimensions (the rest of the canvas is for menus/etc)
export let GAME_WIDTH: number;
export let GAME_HEIGHT: number;

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

    // get a reference to the canvas we'll be working with
    CANVAS = document.getElementById("MainCanvas") as HTMLCanvasElement;

    // canvas for debugging the physics
    CANVAS_DEBUG = document.getElementById("DebugCanvas") as HTMLCanvasElement;

    // create a stage object to work with the canvas. This is the top level node in the display list
    STAGE = new createjs.Stage(CANVAS);

    createjs.Ticker.interval = 50;

    if (DEBUG) {
        showElement(CANVAS_DEBUG);
        centerCanvas(CANVAS_DEBUG);

        // setup debug draw
        const debugDraw = new b2DebugDraw();
        const debugContext = CANVAS_DEBUG.getContext("2d")!;

        debugDraw.SetSprite(debugContext);
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.4);
        debugDraw.SetLineThickness(1);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        WORLD.setDebugDraw(debugDraw);
    }

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

    GameStatistics.start(CANVAS, STAGE);

    GAME_WIDTH = CANVAS.width;
    GAME_HEIGHT = CANVAS.height;

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

    showElement(CANVAS);
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
