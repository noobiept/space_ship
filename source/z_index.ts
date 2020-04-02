import { STAGE } from "./main.js";

/*
    Keep these elements on top (last ones being added to stage)
 */
const ELEMENTS = [];

export function add(element) {
    ELEMENTS.push(element);
}

/*
    Remove an element (just from being pushed to the top, doesn't remove it from the Stage)
 */
export function remove(element) {
    const position = ELEMENTS.indexOf(element);
    ELEMENTS.splice(position, 1);
}

/*
    Remove everything
 */
export function clear() {
    ELEMENTS.length = 0;
}

export function update() {
    $(ELEMENTS).each(function (index, element) {
        // by re-adding the element, it goes to the 'top' of the canvas (is drawn last)
        STAGE.addChild(element);
    });
}
