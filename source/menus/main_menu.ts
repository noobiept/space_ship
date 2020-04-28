import { KEY_CODE } from "@drk4/utilities";
import { CANVAS, resetStuff, startGameMode, setMapMode } from "../main";
import * as Options from "../shared/options";
import { hideElement, showElement } from "../shared/utilities";
import RandomMaps from "../maps/random_maps";
import PredefinedMaps from "../maps/predefined_maps";
import EndlessMode from "../maps/endless_mode";

let ENTRY_SELECTED = 0;

// has the functions to call when choosing an entry
const ENTRIES: (() => void)[] = [];

// has the html elements of the entries
const ENTRIES_ELEMENTS: HTMLElement[] = [];

export function init() {
    const predefinedMaps = document.getElementById("MainMenu-predefinedMaps")!;
    const randomMaps = document.getElementById("MainMenu-randomMaps")!;
    const endlessMode = document.getElementById("MainMenu-endlessMode")!;
    const options = document.getElementById("MainMenu-options")!;

    ENTRIES.push(
        openPredefinedMaps,
        openRandomMaps,
        openEndlessMode,
        openOptions
    );

    const listener = (callback: () => void) => {
        return (event: MouseEvent) => {
            callback();

            // prevent the click to select the entry, to also fire a bullet once the game starts
            event.stopPropagation();
        };
    };

    ENTRIES_ELEMENTS.push(predefinedMaps, randomMaps, endlessMode, options);

    predefinedMaps.onclick = listener(openPredefinedMaps);
    randomMaps.onclick = listener(openRandomMaps);
    endlessMode.onclick = listener(openEndlessMode);
    options.onclick = listener(openOptions);

    initOptions();
}

export function open() {
    hideElement(CANVAS);
    resetStuff();
    cleanUp();

    showElement("MainMenu");

    ENTRY_SELECTED = 0;

    const predefinedMaps = document.getElementById("MainMenu-predefinedMaps")!;
    predefinedMaps.classList.add("MainMenu-entrySelected");

    document.onkeyup = keyboardEvents;
}

function openPredefinedMaps() {
    cleanUp();
    setMapMode(PredefinedMaps);
    startGameMode();
}

function openRandomMaps() {
    cleanUp();
    setMapMode(RandomMaps);
    startGameMode();
}

function openEndlessMode() {
    cleanUp();
    setMapMode(EndlessMode);
    startGameMode();
}

function openOptions() {
    cleanUp();
    showElement("Options");
}

function keyboardEvents(event: KeyboardEvent) {
    var key = event.keyCode;

    // start the game
    if (key === KEY_CODE.enter) {
        ENTRIES[ENTRY_SELECTED]();
    } else if (key === KEY_CODE.downArrow) {
        selectNextEntry();
    } else if (key === KEY_CODE.upArrow) {
        selectPreviousEntry();
    }
}

/*
 * Select the next entry on the menu (update the animation).
 */
function selectNextEntry() {
    var previousEntry = ENTRY_SELECTED;

    ENTRY_SELECTED++;

    if (ENTRY_SELECTED + 1 > ENTRIES.length) {
        ENTRY_SELECTED = 0;
    }

    ENTRIES_ELEMENTS[previousEntry].classList.remove("MainMenu-entrySelected");
    ENTRIES_ELEMENTS[ENTRY_SELECTED].classList.add("MainMenu-entrySelected");
}

/*
 * Select the previous entry on the menu (update the animation).
 */
function selectPreviousEntry() {
    var previousEntry = ENTRY_SELECTED;

    ENTRY_SELECTED--;

    if (ENTRY_SELECTED < 0) {
        ENTRY_SELECTED = ENTRIES.length - 1;
    }

    const previous = ENTRIES_ELEMENTS[previousEntry];
    previous.classList.remove("MainMenu-entrySelected");

    const selected = ENTRIES_ELEMENTS[ENTRY_SELECTED];
    selected.classList.add("MainMenu-entrySelected");
}

/*
 * Call when moving away from the MainMenu.
 */
function cleanUp() {
    hideElement("MainMenu");
    hideElement("Options");

    document.onkeyup = null;

    const selected = ENTRIES_ELEMENTS[ENTRY_SELECTED];
    selected.classList.remove("MainMenu-entrySelected");

    ENTRY_SELECTED = 0;
}

function initOptions() {
    const musicVolumeValue = Math.round(Options.getMusicVolume() * 100);
    const musicVolume = document.getElementById("Options-musicVolume")!;
    const volume = document.getElementById(
        "Options-RangeInput"
    ) as HTMLInputElement;

    volume.value = musicVolumeValue.toString();
    musicVolume.innerText = musicVolumeValue + "%";

    volume.oninput = () => {
        const value = volume.value;

        musicVolume.innerText = value + "%";
        Options.setMusicVolume(parseInt(value) / 100);
    };

    const back = document.getElementById("Options-back")!;
    back.onclick = function () {
        Options.save();
        open();
    };
}
