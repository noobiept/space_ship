import * as MainMenu from "./main_menu.js";
import { MAIN_SHIP, startGameMode, resume, pause, CANVAS } from "../main.js";
import Message from "../shared/message.js";
import { hideElement, showElement } from "../shared/utilities.js";

let WEAPON_SELECTED = 0;
const WEAPON_ELEMENTS = [];
const BULLETS_LEFT_ELEMENTS = [];

export function init() {
    clear();

    const menu = document.getElementById("GameMenu");

    // :: Weapons Selection :: //
    const weapon1 = document.getElementById("GameMenu-weapon1");
    const weapon2 = document.getElementById("GameMenu-weapon2");
    const weapon3 = document.getElementById("GameMenu-weapon3");
    const weapon4 = document.getElementById("GameMenu-weapon4");

    WEAPON_ELEMENTS.push(weapon1, weapon2, weapon3, weapon4);

    WEAPON_SELECTED = 0;
    $(weapon1).addClass("WeaponsSelected");

    weapon1.onclick = function () {
        MAIN_SHIP.selectWeapon(0);
    };

    weapon2.onclick = function () {
        MAIN_SHIP.selectWeapon(1);
    };

    weapon3.onclick = function () {
        MAIN_SHIP.selectWeapon(2);
    };

    weapon4.onclick = function () {
        MAIN_SHIP.selectWeapon(3);
    };

    // :: Bullets Left :: //

    const bulletsLeft1 = document.getElementById("GameMenu-bullets1");
    const bulletsLeft2 = document.getElementById("GameMenu-bullets2");
    const bulletsLeft3 = document.getElementById("GameMenu-bullets3");
    const bulletsLeft4 = document.getElementById("GameMenu-bullets4");

    BULLETS_LEFT_ELEMENTS.push(
        bulletsLeft1,
        bulletsLeft2,
        bulletsLeft3,
        bulletsLeft4
    );

    updateAllBulletsLeft();

    // :: Restart :: //

    var restart = document.getElementById("GameMenu-restart");

    restart.onclick = function (event) {
        startGameMode(true);

        // prevent the click to select the entry, to also fire a bullet once the game starts
        event.stopPropagation();
    };

    // :: Quit :: //

    const quit = document.getElementById("GameMenu-quit");
    quit.onclick = function (event) {
        MainMenu.open();

        event.stopPropagation();
    };

    hideElement(quit);
    hideElement(restart);

    // :: Open the Menu :: //

    var openMenu = document.getElementById("GameMenu-openMenu");

    $(openMenu).text("Menu");

    var isOpened = false;
    var pausedMessage = null;

    openMenu.onclick = function (event) {
        if (isOpened) {
            isOpened = false;
            pausedMessage.remove();

            $(openMenu).text("Menu");

            hideElement(quit);
            hideElement(restart);

            resume();
        } else {
            isOpened = true;

            pausedMessage = new Message({
                text: "Paused",
                cssClass: "GamePausedMessage",
            });

            $(openMenu).text("Back");

            showElement(quit);
            showElement(restart);

            pause();
        }

        event.stopPropagation();
    };

    // :: Position the menu :: //
    menu.style.width = CANVAS.width + "px";
    showElement(menu);
}

/*
    number is zero-based
 */
export function selectWeapon(number) {
    if (number !== WEAPON_SELECTED) {
        // remove the css class from the previous element
        $(WEAPON_ELEMENTS[WEAPON_SELECTED]).removeClass("WeaponsSelected");

        WEAPON_SELECTED = number;

        // add to the new
        $(WEAPON_ELEMENTS[WEAPON_SELECTED]).addClass("WeaponsSelected");
    }
}

/*
    Updates the number of bullets left (zero-based)
 */
export function updateBulletsLeft(weapon, bulletsLeft) {
    var bulletsElement = BULLETS_LEFT_ELEMENTS[weapon];

    $(bulletsElement).text(bulletsLeft);
}

export function updateAllBulletsLeft() {
    for (var i = 0; i < BULLETS_LEFT_ELEMENTS.length; i++) {
        updateBulletsLeft(i, MAIN_SHIP.getBulletsLeft(i));
    }
}

export function clear() {
    $(WEAPON_ELEMENTS[WEAPON_SELECTED]).removeClass("WeaponsSelected");

    WEAPON_ELEMENTS.length = 0;
    BULLETS_LEFT_ELEMENTS.length = 0;

    WEAPON_SELECTED = 0;
}
