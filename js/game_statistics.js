/*
    Copyright - 2012 - Pedro Ferreira

    This file is part of space_ship_game.

    space_ship_game is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    space_ship_game is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with space_ship_game.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global Text, STAGE, CANVAS, ZIndex, Ship*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{

var BULLETS_LEFT_TEXT = [
    null,
    null,
    null,
    null
    ];


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


g.score_text = new createjs.Text("Score: " + g.score, "16px Arial", "#777");


    // add the text as a child of the stage. This means it will be drawn any time the stage is updated
    // and that it's transformations will be relative to the stage coordinates
STAGE.addChild( g.score_text );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( g.score_text );

    // position the text on screen, relative to the stage coordinates
g.score_text.x = CANVAS.width - 150;
g.score_text.y = 40;


g.energy_text = new createjs.Text("Energy: " + g.energy, "16px Arial", "#777");

STAGE.addChild( g.energy_text );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( g.energy_text );

g.energy_text.x = g.score_text.x;
g.energy_text.y = g.score_text.y + 30;


g.numberOfEnemies_text = new createjs.Text("Enemies in map: " + g.numberOfEnemies, "16px Arial", "#777");


STAGE.addChild( g.numberOfEnemies_text );

    // we want this to always be drawn on top (of enemies, bullets, etc)
ZIndex.add( g.numberOfEnemies_text );

g.numberOfEnemies_text.x = g.energy_text.x;
g.numberOfEnemies_text.y = g.energy_text.y + 30;


var i;

for (i = 0 ; i < BULLETS_LEFT_TEXT.length ; i++)
    {
    BULLETS_LEFT_TEXT[ i ] = new createjs.Text( Ship.bulletsLeft[ i ] + " Bullets", "14px Arial", "#777");
    
    BULLETS_LEFT_TEXT[ i ].x = 40 + i * 100;
    BULLETS_LEFT_TEXT[ i ].y = CANVAS.height - 13;
    
    STAGE.addChild( BULLETS_LEFT_TEXT[ i ] );

    ZIndex.add( BULLETS_LEFT_TEXT[ i ] );
    }
};




GameStatistics.getScore = function()
{ 
return GameStatistics.score;
};



GameStatistics.updateScore = function( newScore )
{
GameStatistics.score = newScore;

GameStatistics.score_text.text = "Score: " + newScore;    
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



GameStatistics.updateBulletsLeft = function( weapon )
{
BULLETS_LEFT_TEXT[ weapon ].text = Ship.bulletsLeft[ weapon ] + " Bullets";
};




    // public stuff
window.GameStatistics = GameStatistics;


}(window));