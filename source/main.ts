import * as Options from "./shared/options";
import * as GameStatistics from "./menus/game_statistics";
import * as ZIndex from "./z_index";
import * as MainMenu from "./menus/main_menu";
import * as AppStorage from "./app_storage";
import * as GameMenu from "./menus/game_menu";
import Message from "./shared/message";
import Music from "./music";
import EnemyMoveHorizontally from "./enemies/enemy_move_horizontally";
import EnemyRotateAround from "./enemies/enemy_rotate_around";
import EnemyKamikaze from "./enemies/enemy_kamikaze";
import EnemyRocks from "./enemies/enemy_rocks";
import Ship from "./ship";
import { handleKeyDown, handleKeyUp, clearKeysHeld } from "./keyboard_events";
import EnemyShip from "./enemies/enemy_ship";
import Bullet from "./bullets/bullet";
import { MapType, AppData } from "./shared/types";
import { hideElement, showElement } from "./shared/utilities";
import * as CollisionDetection from "./game/collision_detection";
import World from "./game/world";
import { b2DebugDraw, b2ContactListener } from "./shared/constants";

// global variables

export var CANVAS;
var CANVAS_DEBUG;

var DEBUG = false;

var BASE_URL = "";

// createjs

export var STAGE;
export var PRELOAD;

// box2d physics
export const WORLD = new World();

// scale from meters/kilograms/seconds into pixels
export const SCALE = 30;

// playable dimensions (the rest of the canvas is for menus/etc)
export var GAME_WIDTH;
export var GAME_HEIGHT;

export var MAIN_SHIP;

export const ENEMY_TYPES = [
    EnemyMoveHorizontally,
    EnemyRotateAround,
    EnemyKamikaze,
    EnemyRocks,
];

var MAP_MODE = null;
var GAME_OBJECT = null;
var LOADING_MESSAGE;

window.onload = function () {
    AppStorage.getData(["space_ship_options"], initApp);
};

function initApp(data: AppData) {
    Options.load(data["space_ship_options"]);
    MainMenu.init();

    // get a reference to the canvas we'll be working with
    CANVAS = document.querySelector("#mainCanvas");

    // canvas for debugging the physics
    CANVAS_DEBUG = document.querySelector("#debugCanvas");

    // create a stage object to work with the canvas. This is the top level node in the display list
    STAGE = new createjs.Stage(CANVAS);

    createjs.Ticker.setInterval(50);

    if (DEBUG) {
        showElement(CANVAS_DEBUG);
        centerCanvas(CANVAS_DEBUG);

        // setup debug draw
        var debugDraw = new b2DebugDraw();

        debugDraw.SetSprite(CANVAS_DEBUG.getContext("2d"));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.4);
        debugDraw.SetLineThickness(1);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        WORLD.setDebugDraw(debugDraw);
    }

    PRELOAD = new createjs.LoadQueue();

    var manifest = [
        { id: "level1", src: BASE_URL + "maps/level1.json" },
        { id: "level2", src: BASE_URL + "maps/level2.json" },
        { id: "level3", src: BASE_URL + "maps/level3.json" },
        { id: "level4", src: BASE_URL + "maps/level4.json" },
        { id: "level5", src: BASE_URL + "maps/level5.json" },
        { id: "level6", src: BASE_URL + "maps/level6.json" },
        { id: "level7", src: BASE_URL + "maps/level7.json" },
        { id: "level8", src: BASE_URL + "maps/level8.json" },
        { id: "level9", src: BASE_URL + "maps/level9.json" },
        { id: "level10", src: BASE_URL + "maps/level10.json" },

        { id: "scumm_bar", src: BASE_URL + "sound/scumm_bar.ogg" },
        { id: "space_ship_1", src: BASE_URL + "sound/space_ship_1.ogg" },
        { id: "dry_fire", src: BASE_URL + "sound/dry_fire.ogg" },

        {
            id: "enemy_move_horizontally",
            src: BASE_URL + "images/enemy_move_horizontally.png",
        },
        { id: "enemy_rocks", src: BASE_URL + "images/enemy_rocks.png" },
        {
            id: "enemy_rotate_around",
            src: BASE_URL + "images/enemy_rotate_around.png",
        },
        { id: "enemy_kamikaze", src: BASE_URL + "images/enemy_kamikaze.png" },
        { id: "ship", src: BASE_URL + "images/ship.png" },
    ];

    LOADING_MESSAGE = new Message({ text: "Loading", centerWindow: true });

    PRELOAD.installPlugin(createjs.Sound);
    PRELOAD.addEventListener("progress", updateLoading);
    PRELOAD.addEventListener("complete", MainMenu.open);
    PRELOAD.loadManifest(manifest, true);
}

function updateLoading(event) {
    LOADING_MESSAGE.setText("Loading " + ((event.progress * 100) | 0) + "%");
}

export function removeLoadingMessage() {
    if (LOADING_MESSAGE) {
        LOADING_MESSAGE.remove();
        LOADING_MESSAGE = null;
    }
}

export function initGame() {
    resetStuff();

    GameStatistics.start();

    GAME_WIDTH = CANVAS.width;
    GAME_HEIGHT = CANVAS.height;

    MAIN_SHIP = new Ship();

    // so that .tick() of EnemyShip/Ship/... is called automatically
    createjs.Ticker.on("tick", tick);

    // call update on the stage to make it render the current display list to the canvas
    STAGE.update();

    // set up collision detection
    const listener = new b2ContactListener();
    listener.BeginContact = CollisionDetection.onContact;

    WORLD.setContactListener(listener);

    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    new Music(0);

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
    GAME_OBJECT = new MAP_MODE();

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

/*
    center the canvas in the middle of window
 */

function centerCanvas(canvasElement) {
    var left = window.innerWidth / 2 - canvasElement.width / 2;
    var top = window.innerHeight / 2 - canvasElement.height / 2;

    $(canvasElement).css("left", left + "px");
    $(canvasElement).css("top", top + "px");
}

export function setMapMode(mode: MapType) {
    MAP_MODE = mode;
}

/*
    Resets the configurations (for when restarting the game)
 */

export function resetStuff() {
    STAGE.removeAllChildren();

    // unbind the event
    STAGE.onMouseDown = null;

    createjs.Ticker.removeAllEventListeners();

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

    GAME_OBJECT.tick(event);
    WORLD.tick();

    STAGE.update();
}
