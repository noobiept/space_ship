import { STAGE, CANVAS, MAIN_SHIP } from './main'


let SCORE = 0;
let SCORE_TEXT = null;

let ENERGY = 100;
let ENERGY_TEXT = null;

let NUMBER_OF_ENEMIES = 0;
let NUMBER_OF_ENEMIES_TEXT = null;


export function start()
{
SCORE = 0;
ENERGY = 100;
NUMBER_OF_ENEMIES = 0;

    // :: Score :: //

SCORE_TEXT = new createjs.Text("Score: " + SCORE, "16px Arial", "#777");


    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
STAGE.addChild( SCORE_TEXT );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( SCORE_TEXT );

    // position the text on screen, relative to the stage coordinates
SCORE_TEXT.x = CANVAS.width - 100;
SCORE_TEXT.y = 10;


    // :: Energy :: //

ENERGY_TEXT = new createjs.Text("Energy: " + ENERGY, "16px Arial", "#777");

STAGE.addChild( ENERGY_TEXT );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( ENERGY_TEXT );

ENERGY_TEXT.x = SCORE_TEXT.x;
ENERGY_TEXT.y = SCORE_TEXT.y + 30;


    // :: Number of Enemies :: //

NUMBER_OF_ENEMIES_TEXT = new createjs.Text("Enemies: " + NUMBER_OF_ENEMIES, "16px Arial", "#777");


STAGE.addChild( NUMBER_OF_ENEMIES_TEXT );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( NUMBER_OF_ENEMIES_TEXT );

NUMBER_OF_ENEMIES_TEXT.x = ENERGY_TEXT.x;
NUMBER_OF_ENEMIES_TEXT.y = ENERGY_TEXT.y + 30;
};


export function getScore()
{
return SCORE;
};


export function updateScore( newScore )
{
SCORE = newScore;
SCORE_TEXT.text = "Score: " + newScore;
};


export function getNumberOfEnemies()
{
return NUMBER_OF_ENEMIES;
};


export function updateNumberOfEnemies( newNumber )
{
NUMBER_OF_ENEMIES = newNumber;
NUMBER_OF_ENEMIES_TEXT.text = "Enemies: " + newNumber;
};


export function getShipEnergy()
{
return ENERGY;
};


export function updateShipEnergy( newEnergy )
{
ENERGY = newEnergy;
ENERGY_TEXT.text = "Energy: " + newEnergy;
};


/*
    Arguments:

        weapon (number) : zero-based weapon to update
 */
export function updateBulletsLeft( weapon )
{
const bulletsLeft = MAIN_SHIP.getBulletsLeft( weapon );

GameMenu.updateBulletsLeft( weapon, bulletsLeft );
};
