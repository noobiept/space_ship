import * as MainMenu from "./main_menu";
import * as Canvas from "../game/canvas";
import { MAIN_SHIP, startGameMode, resume, pause } from "../main";
import Message from "../shared/message";
import { hideElement, showElement } from "../shared/utilities";

let WEAPON_SELECTED = 0;
let SUB_MENU_OPENED = false;
let PAUSED_MESSAGE: Message | null = null;

const WEAPON_ELEMENTS: HTMLElement[] = [];
const BULLETS_LEFT_ELEMENTS: HTMLElement[] = [];

export function init() {
    // :: Weapons Selection :: //
    const weapon1 = document.getElementById("GameMenu-weapon1")!;
    const weapon2 = document.getElementById("GameMenu-weapon2")!;
    const weapon3 = document.getElementById("GameMenu-weapon3")!;
    const weapon4 = document.getElementById("GameMenu-weapon4")!;

    WEAPON_ELEMENTS.push(weapon1, weapon2, weapon3, weapon4);

    WEAPON_SELECTED = 0;
    weapon1.classList.add("WeaponsSelected");

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

    const bulletsLeft1 = document.getElementById("GameMenu-bullets1")!;
    const bulletsLeft2 = document.getElementById("GameMenu-bullets2")!;
    const bulletsLeft3 = document.getElementById("GameMenu-bullets3")!;
    const bulletsLeft4 = document.getElementById("GameMenu-bullets4")!;

    BULLETS_LEFT_ELEMENTS.push(
        bulletsLeft1,
        bulletsLeft2,
        bulletsLeft3,
        bulletsLeft4
    );

    // :: Restart :: //

    const restart = document.getElementById("GameMenu-restart")!;

    restart.onclick = function (event) {
        startGameMode(true);

        // prevent the click to select the entry, to also fire a bullet once the game starts
        event.stopPropagation();
    };

    // :: Quit :: //

    const quit = document.getElementById("GameMenu-quit")!;
    quit.onclick = function (event) {
        MainMenu.open();

        event.stopPropagation();
    };

    hideElement(quit);
    hideElement(restart);

    // :: Open the Menu :: //

    const openMenu = document.getElementById("GameMenu-openMenu")!;

    openMenu.innerText = "Menu";
    openMenu.onclick = (event) => {
        toggleSubMenu();
        event.stopPropagation();
    };
}

/**
 * Reset the menu to the initial values.
 */
export function reset() {
    selectWeapon(0);
    updateAllBulletsLeft();

    // :: Position the menu :: //
    const menu = document.getElementById("GameMenu")!;
    const { width } = Canvas.getDimensions();

    menu.style.width = width + "px";
    showElement(menu);

    toggleSubMenu(false);
}

function toggleSubMenu(forceState?: boolean) {
    const openMenu = document.getElementById("GameMenu-openMenu")!;
    const quit = document.getElementById("GameMenu-quit")!;
    const restart = document.getElementById("GameMenu-restart")!;

    let open = !SUB_MENU_OPENED;
    if (typeof forceState === "boolean") {
        open = forceState;
    }

    if (open) {
        PAUSED_MESSAGE = new Message({
            text: "Paused",
            cssClass: "GamePausedMessage",
        });

        openMenu.innerText = "Back";

        showElement(quit);
        showElement(restart);

        pause();
    } else {
        PAUSED_MESSAGE?.remove();
        PAUSED_MESSAGE = null;

        openMenu.innerText = "Menu";

        hideElement(quit);
        hideElement(restart);

        resume();
    }

    SUB_MENU_OPENED = open;
}

/*
 * `number` is zero-based.
 */
export function selectWeapon(number: number) {
    if (number !== WEAPON_SELECTED) {
        // remove the css class from the previous element
        WEAPON_ELEMENTS[WEAPON_SELECTED].classList.remove("WeaponsSelected");

        WEAPON_SELECTED = number;

        // add to the new
        WEAPON_ELEMENTS[WEAPON_SELECTED].classList.add("WeaponsSelected");
    }
}

/*
 * Updates the number of bullets left (zero-based).
 */
export function updateBulletsLeft(weapon: number, bulletsLeft: number) {
    const bulletsElement = BULLETS_LEFT_ELEMENTS[weapon];
    bulletsElement.innerText = bulletsLeft.toString();
}

export function updateAllBulletsLeft() {
    for (let i = 0; i < BULLETS_LEFT_ELEMENTS.length; i++) {
        updateBulletsLeft(i, MAIN_SHIP.getBulletsLeft(i));
    }
}

export function clear() {
    WEAPON_ELEMENTS[WEAPON_SELECTED].classList.remove("WeaponsSelected");

    WEAPON_ELEMENTS.length = 0;
    BULLETS_LEFT_ELEMENTS.length = 0;

    WEAPON_SELECTED = 0;
}
