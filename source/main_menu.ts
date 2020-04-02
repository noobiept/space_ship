import {
    CANVAS,
    resetStuff,
    startGameMode,
    STAGE,
    setMapMode,
    removeLoadingMessage,
} from "./main.js";
import * as Music from "./music.js";
import * as Options from "./options.js";
import { EVENT_KEY, hideElement, showElement } from "./utilities.js";
import RandomMaps from "./random_maps.js";
import PredefinedMaps from "./predefined_maps.js";
import EndlessMode from "./endless_mode.js";

let ENTRY_SELECTED = 0;

// has the functions to call when choosing an entry
const ENTRIES: ((e) => void)[] = [];

// has the html elements of the entries
const ENTRIES_ELEMENTS: HTMLElement[] = [];

export function init() {
    const predefinedMaps = document.getElementById("MainMenu-predefinedMaps");
    const randomMaps = document.getElementById("MainMenu-randomMaps");
    const endlessMode = document.getElementById("MainMenu-endlessMode");
    const options = document.getElementById("MainMenu-options");
    const donate = document.getElementById("MainMenu-donate");

    ENTRIES.push(
        openPredefinedMaps,
        openRandomMaps,
        openEndlessMode,
        openOptions,
        openDonate
    );

    ENTRIES_ELEMENTS.push(
        predefinedMaps,
        randomMaps,
        endlessMode,
        options,
        donate
    );

    predefinedMaps.onclick = openPredefinedMaps;
    randomMaps.onclick = openRandomMaps;
    endlessMode.onclick = openEndlessMode;
    options.onclick = openOptions;

    $(document).bind("keyup", keyboardEvents);
}

export function open() {
    removeLoadingMessage();
    hideElement(CANVAS);

    Music.stop();
    resetStuff();
    cleanUp();

    showElement("MainMenu");

    ENTRY_SELECTED = 0;

    const predefinedMaps = document.getElementById("MainMenu-predefinedMaps");
    predefinedMaps.classList.add("MainMenu-entrySelected");

    STAGE.update(); //HERE
}

function openPredefinedMaps(event) {
    cleanUp();
    setMapMode(PredefinedMaps);
    startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
    event.stopPropagation();
}

function openRandomMaps(event) {
    cleanUp();
    setMapMode(RandomMaps);
    startGameMode();

    event.stopPropagation();
}

function openEndlessMode(event) {
    cleanUp();
    setMapMode(EndlessMode);
    startGameMode();

    // prevent the click to select the entry, to also fire a bullet once the game starts
    event.stopPropagation();
}

function openOptions(event) {
    cleanUp();

    // :: Music Volume :: //

    const musicVolume = document.getElementById("Options-musicVolume");
    const musicVolumeSpan = musicVolume.querySelector("span");

    const musicVolumeValue = Math.round(Options.getMusicVolume() * 100);

    $(musicVolumeSpan).text(musicVolumeValue + "%");

    const musicVolumeSlider = musicVolume.querySelector(
        "#Options-musicVolume-slider"
    );

    $(musicVolumeSlider).slider({
        min: 0,
        max: 100,
        step: 1,
        value: musicVolumeValue,
        range: "min",
        slide: function (event, ui) {
            $(musicVolumeSpan).text(ui.value + "%");

            Options.setMusicVolume(ui.value / 100);
        },
    });

    const back = document.getElementById("Options-back");
    back.onclick = function () {
        Options.save();
        open();
    };

    showElement("Options");
}

function openDonate() {
    document.getElementById("MainMenu-donate").click();
}

function keyboardEvents(event) {
    var key = event.keyCode;

    // start the game
    if (key === EVENT_KEY.enter) {
        ENTRIES[ENTRY_SELECTED](event);
    } else if (key === EVENT_KEY.downArrow) {
        selectNextEntry();
    } else if (key === EVENT_KEY.upArrow) {
        selectPreviousEntry();
    }
}

/*
    Select the next entry on the menu (update the animation)
 */
function selectNextEntry() {
    var previousEntry = ENTRY_SELECTED;

    ENTRY_SELECTED++;

    if (ENTRY_SELECTED + 1 > ENTRIES.length) {
        ENTRY_SELECTED = 0;
    }

    $(ENTRIES_ELEMENTS[previousEntry]).removeClass("MainMenu-entrySelected");

    $(ENTRIES_ELEMENTS[ENTRY_SELECTED]).addClass("MainMenu-entrySelected");
}

/*
    Select the previous entry on the menu (update the animation)
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
    Call when moving away from the MainMenu
 */
function cleanUp() {
    hideElement("MainMenu");
    hideElement("Options");

    $(document).unbind("keyup");

    const selected = ENTRIES_ELEMENTS[ENTRY_SELECTED];
    selected.classList.remove("MainMenu-entrySelected");

    ENTRY_SELECTED = 0;
    ENTRIES.length = 0;
}
