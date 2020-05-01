import { showElement, hideElement } from "../shared/utilities";
import { b2DebugDraw, SCALE } from "../shared/constants";
import { WORLD, inDebugMode } from "../main";

let CANVAS: HTMLCanvasElement;
let CANVAS_DEBUG: HTMLCanvasElement;

export function init(debug: boolean) {
    // get a reference to the canvas we'll be working with
    CANVAS = document.getElementById("MainCanvas") as HTMLCanvasElement;

    // canvas for debugging the physics
    CANVAS_DEBUG = document.getElementById("DebugCanvas") as HTMLCanvasElement;

    if (debug) {
        // setup debug draw
        const debugDraw = new b2DebugDraw();
        const debugContext = CANVAS_DEBUG.getContext("2d")!;

        debugDraw.SetSprite(debugContext);
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.4);
        debugDraw.SetLineThickness(1);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        WORLD.setDebugDraw(debugDraw);
    }

    return CANVAS;
}

export function getDimensions() {
    return {
        width: CANVAS.width,
        height: CANVAS.height,
    };
}

export function showCanvas() {
    showElement(CANVAS);

    if (inDebugMode()) {
        showElement(CANVAS_DEBUG);
    }
}

export function hideCanvas() {
    hideElement(CANVAS);

    if (inDebugMode()) {
        hideElement(CANVAS_DEBUG);
    }
}

export function getReference() {
    return CANVAS;
}
