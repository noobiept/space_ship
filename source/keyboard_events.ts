import { EVENT_KEY } from "./shared/utilities.js";
import { MAIN_SHIP } from "./main.js";

// keys being pressed/held
export const KEYS_HELD = {
    left: false,
    right: false,
    up: false,
    down: false,
};

export function clearKeysHeld() {
    KEYS_HELD.left = false;
    KEYS_HELD.right = false;
    KEYS_HELD.up = false;
    KEYS_HELD.down = false;
}

export function handleKeyDown(event) {
    if (!event) {
        event = window.event;
    }

    switch (event.keyCode) {
        case EVENT_KEY.a:
        case EVENT_KEY.leftArrow:
            KEYS_HELD.left = true;
            return false;

        case EVENT_KEY.d:
        case EVENT_KEY.rightArrow:
            KEYS_HELD.right = true;
            return false;

        case EVENT_KEY.w:
        case EVENT_KEY.upArrow:
            KEYS_HELD.up = true;
            return false;

        case EVENT_KEY.s:
        case EVENT_KEY.downArrow:
            KEYS_HELD.down = true;
            return false;
    }
}

export function handleKeyUp(event) {
    if (!event) {
        event = window.event;
    }

    switch (event.keyCode) {
        case EVENT_KEY.a:
        case EVENT_KEY.leftArrow:
            KEYS_HELD.left = false;
            break;

        case EVENT_KEY.d:
        case EVENT_KEY.rightArrow:
            KEYS_HELD.right = false;
            break;

        case EVENT_KEY.w:
        case EVENT_KEY.upArrow:
            KEYS_HELD.up = false;
            break;

        case EVENT_KEY.s:
        case EVENT_KEY.downArrow:
            KEYS_HELD.down = false;
            break;

        case EVENT_KEY["1"]:
            MAIN_SHIP.selectWeapon(0);
            break;

        case EVENT_KEY["2"]:
            MAIN_SHIP.selectWeapon(1);
            break;

        case EVENT_KEY["3"]:
            MAIN_SHIP.selectWeapon(2);
            break;

        case EVENT_KEY["4"]:
            MAIN_SHIP.selectWeapon(3);
            break;
    }
}
