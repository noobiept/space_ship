"use strict";

(function(window)
{
var WEAPON_SELECTED = 0;

var WEAPON_ELEMENTS = [];

var BULLETS_LEFT_ELEMENTS = [];


function GameMenu()
{
GameMenu.clear();

var menu = document.querySelector( '#GameMenu' );

    // :: Weapons Selection :: //

var weaponsContainer = menu.querySelector( '#GameMenu-selectWeapon' );


var weapon1 = weaponsContainer.querySelector( '#GameMenu-weapon1' );
var weapon2 = weaponsContainer.querySelector( '#GameMenu-weapon2' );
var weapon3 = weaponsContainer.querySelector( '#GameMenu-weapon3' );
var weapon4 = weaponsContainer.querySelector( '#GameMenu-weapon4' );

WEAPON_ELEMENTS.push( weapon1, weapon2, weapon3, weapon4 );

WEAPON_SELECTED = 0;
$( weapon1 ).addClass( 'WeaponsSelected' );


weapon1.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 1 );
    };

weapon2.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 2 );
    };

weapon3.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 3 );
    };

weapon4.onclick = function()
    {
    MAIN_SHIP.selectWeapon( 4 );
    };



    // :: Bullets Left :: //

var bulletsContainer = menu.querySelector( '#GameMenu-bulletsLeft' );

var bulletsLeft1 = bulletsContainer.querySelector( '#GameMenu-bullets1' );
var bulletsLeft2 = bulletsContainer.querySelector( '#GameMenu-bullets2' );
var bulletsLeft3 = bulletsContainer.querySelector( '#GameMenu-bullets3' );
var bulletsLeft4 = bulletsContainer.querySelector( '#GameMenu-bullets4' );


BULLETS_LEFT_ELEMENTS.push( bulletsLeft1, bulletsLeft2, bulletsLeft3, bulletsLeft4 );


GameMenu.updateAllBulletsLeft();


    // :: Restart :: //

var restart = menu.querySelector( '#GameMenu-restart' );

restart.onclick = function()
    {
    GAME_MODE();
    };

    // :: Quit :: //

var quit = menu.querySelector( '#GameMenu-quit' );

quit.onclick = function()
    {
    MainMenu.open();
    };


    // :: Position the menu :: //

$( menu ).css( 'width', CANVAS.width + 'px' );

    // +10 for the border etc
positionHtmlElement( menu, 0, CANVAS.height + 10 );


$( '#GameMenu' ).css( 'display', 'block' );
}


/*
    number is zero-based
 */

GameMenu.selectWeapon = function( number )
{
if ( number !== WEAPON_SELECTED )
    {
        // remove the css class from the previous element
    $( WEAPON_ELEMENTS[ WEAPON_SELECTED ] ).removeClass( 'WeaponsSelected' );

    WEAPON_SELECTED = number;

        // add to the new
    $( WEAPON_ELEMENTS[ WEAPON_SELECTED ] ).addClass( 'WeaponsSelected' );
    }
};




/*
    Updates the number of bullets left (zero-based)
 */

GameMenu.updateBulletsLeft = function( weapon, bulletsLeft )
{
var bulletsElement = BULLETS_LEFT_ELEMENTS[ weapon ];

bulletsElement.innerText = bulletsLeft;
};


GameMenu.updateAllBulletsLeft = function()
{
for (var i = 0 ; i < BULLETS_LEFT_ELEMENTS.length ; i++)
    {
    GameMenu.updateBulletsLeft( i,MAIN_SHIP.getBulletsLeft( i ) );
    }
};


GameMenu.clear = function()
{
$( WEAPON_ELEMENTS[ WEAPON_SELECTED ] ).removeClass( 'WeaponsSelected' );

WEAPON_ELEMENTS.length = 0;
BULLETS_LEFT_ELEMENTS.length = 0;

WEAPON_SELECTED = 0;
};


window.GameMenu = GameMenu;

}(window));