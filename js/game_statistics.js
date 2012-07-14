/*global Text, STAGE, CANVAS*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{


function GameStatistics()
{
GameStatistics.score = 0;
GameStatistics.score_text = null;

GameStatistics.energy = 100;
GameStatistics.energy_text = null;

GameStatistics.numberOfEnemies = 0;
GameStatistics.numberOfEnemies_text = null;
}



GameStatistics.start = function()
{
var g = GameStatistics;

g.score = 0;
g.energy = 100;
g.numberOfEnemies = 0;


g.score_text = new Text("Enemies killed: " + g.score, "16px Arial", "#777");


    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
STAGE.addChild( g.score_text );

    // position the text on screen, relative to the stage coordinates
g.score_text.x = CANVAS.width - 150;
g.score_text.y = 40;


g.energy_text = new Text("Energy: " + g.energy, "16px Arial", "#777");

STAGE.addChild( g.energy_text );

g.energy_text.x = g.score_text.x;
g.energy_text.y = g.score_text.y + 30;


g.numberOfEnemies_text = new Text("Enemies in map: " + g.numberOfEnemies, "16px Arial", "#777");


STAGE.addChild( g.numberOfEnemies_text );

g.numberOfEnemies_text.x = g.energy_text.x;
g.numberOfEnemies_text.y = g.energy_text.y + 30;

};






GameStatistics.getScore = function()
{ 
return GameStatistics.score;
};



GameStatistics.updateScore = function( newScore )
{
GameStatistics.score = newScore;

GameStatistics.score_text.text = "Enemies killed: " + newScore;    
};



GameStatistics.getNumberOfEnemies = function()
{
return GameStatistics.numberOfEnemies;
};


GameStatistics.updateNumberOfEnemies = function( newNumber )
{
var g = GameStatistics;

g.numberOfEnemies = newNumber;

g.numberOfEnemies_text.text = "Enemies in map: " + g.numberOfEnemies;
};


GameStatistics.getShipEnergy = function()
{
return GameStatistics.energy;
};


GameStatistics.updateShipEnergy = function( newEnergy )
{
var g = GameStatistics;

g.energy = newEnergy;

g.energy_text.text = "Energy: " + g.energy;
};




    // public stuff
window.GameStatistics = GameStatistics;


}(window));