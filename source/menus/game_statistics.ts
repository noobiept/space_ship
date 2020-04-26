import * as ZIndex from "../game/z_index";

let SCORE = 0;
let SCORE_TEXT: createjs.Text;

let ENERGY = 100;
let ENERGY_TEXT: createjs.Text;

let NUMBER_OF_ENEMIES = 0;
let NUMBER_OF_ENEMIES_TEXT: createjs.Text;

export function start(canvas: HTMLCanvasElement, stage: createjs.Stage) {
    SCORE = 0;
    ENERGY = 100;
    NUMBER_OF_ENEMIES = 0;

    // :: Score :: //

    SCORE_TEXT = new createjs.Text("Score: " + SCORE, "16px Arial", "#777");

    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
    stage.addChild(SCORE_TEXT);

    // we want this to always be drawn on top (of enemies, bullets, etc)
    ZIndex.add(SCORE_TEXT);

    // position the text on screen, relative to the stage coordinates
    SCORE_TEXT.x = canvas.width - 100;
    SCORE_TEXT.y = 10;

    // :: Energy :: //

    ENERGY_TEXT = new createjs.Text("Energy: " + ENERGY, "16px Arial", "#777");

    stage.addChild(ENERGY_TEXT);

    // we want this to always be drawn on top (of enemies, bullets, etc)
    ZIndex.add(ENERGY_TEXT);

    ENERGY_TEXT.x = SCORE_TEXT.x;
    ENERGY_TEXT.y = SCORE_TEXT.y + 30;

    // :: Number of Enemies :: //

    NUMBER_OF_ENEMIES_TEXT = new createjs.Text(
        "Enemies: " + NUMBER_OF_ENEMIES,
        "16px Arial",
        "#777"
    );

    stage.addChild(NUMBER_OF_ENEMIES_TEXT);

    // we want this to always be drawn on top (of enemies, bullets, etc)
    ZIndex.add(NUMBER_OF_ENEMIES_TEXT);

    NUMBER_OF_ENEMIES_TEXT.x = ENERGY_TEXT.x;
    NUMBER_OF_ENEMIES_TEXT.y = ENERGY_TEXT.y + 30;
}

export function getScore() {
    return SCORE;
}

export function updateScore(newScore: number) {
    SCORE = newScore;
    SCORE_TEXT.text = "Score: " + newScore;
}

export function getNumberOfEnemies() {
    return NUMBER_OF_ENEMIES;
}

export function updateNumberOfEnemies(newNumber: number) {
    NUMBER_OF_ENEMIES = newNumber;
    NUMBER_OF_ENEMIES_TEXT.text = "Enemies: " + newNumber;
}

export function getShipEnergy() {
    return ENERGY;
}

export function updateShipEnergy(newEnergy: number) {
    ENERGY = newEnergy;
    ENERGY_TEXT.text = "Energy: " + newEnergy;
}
