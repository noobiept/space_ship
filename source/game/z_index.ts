import { STAGE } from "../main";

/*
 * Keep these elements on top (last ones being added to stage).
 */
const ELEMENTS: createjs.DisplayObject[] = [];

export function add(element: createjs.DisplayObject) {
    ELEMENTS.push(element);
}

/*
 * Remove an element (just from being pushed to the top, doesn't remove it from the Stage).
 */
export function remove(element: createjs.DisplayObject) {
    const position = ELEMENTS.indexOf(element);
    ELEMENTS.splice(position, 1);
}

/*
 * Remove everything.
 */
export function clear() {
    ELEMENTS.length = 0;
}

export function update() {
    ELEMENTS.forEach((element) => {
        // by re-adding the element, it goes to the 'top' of the canvas (is drawn last)
        STAGE.addChild(element);
    });
}
