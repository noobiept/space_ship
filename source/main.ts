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
import { handleKeyDown, handleKeyUp, clearKeysHeld } from "./keyboard_events";
import EnemyShip from "./enemies/enemy_ship";
import Bullet from "./bullets/bullet";
import { MapType, AppData, MapTypeClass } from "./shared/types";
import { hideElement, showElement, centerCanvas } from "./shared/utilities";
import * as CollisionDetection from "./game/collision_detection";
import World from "./game/world";
import { b2DebugDraw, b2ContactListener, SCALE } from "./shared/constants";

// global variables

export var CANVAS: HTMLCanvasElement;
var CANVAS_DEBUG;

var DEBUG = false;

const MUSIC = new Music({
    songIDs: ["Audio-music1", "Audio-music2"],
});

// createjs
export var STAGE: createjs.Stage;

// box2d physics
export const WORLD = new World();

// playable dimensions (the rest of the canvas is for menus/etc)
export var GAME_WIDTH: number;
export var GAME_HEIGHT: number;

export var MAIN_SHIP: Ship;

let MAP_MODE: MapTypeClass | null = null;
let GAME_OBJECT: MapType | null = null;

window.onload = function () {
    AppStorage.getData(["space_ship_options"], initApp);
};

function initApp(data: AppData) {
    Options.load(data["space_ship_options"]);
    MainMenu.init();

    // get a reference to the canvas we'll be working with
    CANVAS = document.getElementById("mainCanvas") as HTMLCanvasElement;

    // canvas for debugging the physics
    CANVAS_DEBUG = document.getElementById("debugCanvas") as HTMLCanvasElement;

    // create a stage object to work with the canvas. This is the top level node in the display list
    STAGE = new createjs.Stage(CANVAS);

    createjs.Ticker.setInterval(50);

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

    GameStatistics.start();

    GAME_WIDTH = CANVAS.width;
    GAME_HEIGHT = CANVAS.height;

    MAIN_SHIP = new Ship();

    // so that .tick() of EnemyShip/Ship/... is called automatically
    createjs.Ticker.on("tick", tick as (event: Object) => void);

    // call update on the stage to make it render the current display list to the canvas
    STAGE.update();

    // set up collision detection
    const listener = new b2ContactListener();
    listener.BeginContact = CollisionDetection.onContact;

    WORLD.setContactListener(listener);

    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    MUSIC.play(0);
    GameMenu.init();
}

/**
    @param {Boolean} [fromPreviousLevel=false] restarting the game, starting at same level it was before
 */
export function startGameMode(fromPreviousLevel?: boolean) {
    if (typeof fromPreviousLevel == "undefined") {
        fromPreviousLevel = false;
    }

    var startingLevel = 0;

    if (GAME_OBJECT) {
        if (fromPreviousLevel) {
            startingLevel = GAME_OBJECT.CURRENT_MAP;
        }
    }

    resetStuff();

    showElement(CANVAS);
    GAME_OBJECT = new MAP_MODE!();

    //HERE
    if (GAME_OBJECT.loadMap) {
        GAME_OBJECT.loadMap(startingLevel);
    }
}

export function pause() {
    if (MAIN_SHIP) {
        MAIN_SHIP.clearEvents();
    }

    createjs.Ticker.setPaused(true);
}

export function resume() {
    if (MAIN_SHIP) {
        MAIN_SHIP.setEvents();
    }

    createjs.Ticker.setPaused(false);
}

export function setMapMode(mode: MapTypeClass) {
    MAP_MODE = mode;
}

/*
    Resets the configurations (for when restarting the game)
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
    createjs.Ticker.setPaused(false);

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
