import { KEY_CODE } from "@drk4/utilities";

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

export function handleKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
        case KEY_CODE.a:
        case KEY_CODE.leftArrow:
            KEYS_HELD.left = true;
            return false;

        case KEY_CODE.d:
        case KEY_CODE.rightArrow:
            KEYS_HELD.right = true;
            return false;

        case KEY_CODE.w:
        case KEY_CODE.upArrow:
            KEYS_HELD.up = true;
            return false;

        case KEY_CODE.s:
        case KEY_CODE.downArrow:
            KEYS_HELD.down = true;
            return false;
    }
}

export function handleKeyUp(selectWeapon: (position: number) => void) {
    return (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case KEY_CODE.a:
            case KEY_CODE.leftArrow:
                KEYS_HELD.left = false;
                break;

            case KEY_CODE.d:
            case KEY_CODE.rightArrow:
                KEYS_HELD.right = false;
                break;

            case KEY_CODE.w:
            case KEY_CODE.upArrow:
                KEYS_HELD.up = false;
                break;

            case KEY_CODE.s:
            case KEY_CODE.downArrow:
                KEYS_HELD.down = false;
                break;

            case KEY_CODE["1"]:
                selectWeapon(0);
                break;

            case KEY_CODE["2"]:
                selectWeapon(1);
                break;

            case KEY_CODE["3"]:
                selectWeapon(2);
                break;

            case KEY_CODE["4"]:
                selectWeapon(3);
                break;
        }
    };
}

export function gameOverShortcuts(onEnter: () => void) {
    return (event: KeyboardEvent) => {
        if (event.keyCode === KEY_CODE.enter) {
            onEnter();
        }
    };
}
