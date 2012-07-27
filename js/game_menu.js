/*global Text, STAGE, Ticker, CANVAS, Shape, SoundJS, SpriteSheet, BitmapAnimation*/
/*jslint vars: true, white: true*/


"use strict";

function GameMenu()
{
GameMenu.addMenuButton();
GameMenu.addWeaponsSelection();
}



GameMenu.addMenuButton = function()
{
var spriteSheet = {

    animations: {
        main: {
            frames: [ 0 ],
            next: "main"
            }
        },
    frames: {
        width: 50,
        height: 20
        },
    images: [ "images/open_game_menu.png" ]
    };
    
var menuButtonSprite = new SpriteSheet( spriteSheet );

var menuButton = new BitmapAnimation( menuButtonSprite ); 

menuButton.gotoAndPlay("main");

menuButton.x = CANVAS.width - 50;
menuButton.y = CANVAS.height - 40;

menuButton.onClick = function()
    {
    GameMenu.openMenu();
    };

STAGE.addChild( menuButton );
};



GameMenu.addWeaponsSelection = function()
{
var weaponsSprite = {

    animations: {
        weapon1: {
            frames: [ 0 ],
            next: "weapon1"
            },
        weapon2: {
            frames: [ 1 ],
            next: "weapon2"
            },
        weapon3: {
            frames: [ 2 ],
            next: "weapon3"
            },
        weapon4: {
            frames: [ 3 ],
            next: "weapon4"
            }
        },
    frames: {
        width: 400,
        height: 40
        },
    images: [ "images/weapons_selection.png" ]
    };
    
var sprite = new SpriteSheet( weaponsSprite );

var weapons = new BitmapAnimation( sprite ); 

weapons.gotoAndPlay("weapon1");

weapons.x = 20;
weapons.y = CANVAS.height - 50;


GameMenu.weaponsBitmap = weapons;

STAGE.addChild( weapons );
};



GameMenu.selectWeapon = function( number )
{
if ( number === 1 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon1");
    }

else if ( number === 2 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon2");
    }

else if ( number === 3 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon3");
    }

else if ( number === 4 )
    {
    GameMenu.weaponsBitmap.gotoAndPlay("weapon4");
    }
};



GameMenu.openMenu = function()
{
    // stop the game
Ticker.setPaused( true );

var background = new Shape();

var g = background.graphics;

g.beginFill( "rgba(255, 0, 0, 0.5)" );
g.rect( 40, 40, CANVAS.width - 40, CANVAS.height - 40 );

g.endFill();


var toggleMusic = new Text("Turn Off Music", "14px Arial", "rgb(255, 255, 255)");   //HERE por algo por tras do texto (ao clicar, tem k se acertar mm nas letras)

var musicOn = true;


toggleMusic.onClick = function()
    {
    if ( musicOn )
        {
        musicOn = false;
        
        SoundJS.pause();
        }
    
    else
        {
        musicOn = true;
        
        SoundJS.resume();
        }
    };

toggleMusic.x = 50;
toggleMusic.y = 50;
    
var backToGame = new Text("Back to Game", "14px Arial", "rgb(255, 255, 255)");

backToGame.onClick = function()
    {
    STAGE.removeChild( background );
    STAGE.removeChild( toggleMusic );
    STAGE.removeChild( backToGame );
    
    Ticker.setPaused( false );
    };

backToGame.x = toggleMusic.x;
backToGame.y = toggleMusic.y + 50;
    
STAGE.addChild( background );
STAGE.addChild( toggleMusic );
STAGE.addChild( backToGame );

STAGE.update();
};