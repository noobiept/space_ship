import { toRadians, calculateAngle, toDegrees } from "@drk4/utilities";
import { CANVAS } from "../main";
import { b2Vec2 } from "./constants";
import { GameElement } from "./types";

/**
 * Centers an html element in the middle of a given reference element (assumes html element has in its css 'position: absolute;').
 * If 'refElement' isn't given, its assumed to be the 'CANVAS'.
 */
export function centerElement(element, refElement?) {
    if (typeof refElement === "undefined") {
        refElement = CANVAS;
    }

    var width = $(refElement).width();
    var height = $(refElement).height();

    // the reference element may not be starting at 0,0 position, so we need to account for that
    var canvasPosition = $(refElement).position();

    var left = width / 2 - $(element).width() / 2 + canvasPosition.left;
    var top = height / 2 - $(element).height() / 2 + canvasPosition.top;

    $(element).css({
        top: top + "px",
        left: left + "px",
    });
}

/**
 * Applies an impulse to a body (box2d).
 */
export function applyImpulse(body, degrees, power) {
    const rads = toRadians(degrees);
    const impulse = new b2Vec2(Math.cos(rads) * power, Math.sin(rads) * power);
    const point = body.GetWorldCenter();

    body.ApplyImpulse(impulse, point);
}

/**
 * Applies a force to a body (box2d).
 */
export function applyForce(body, degrees, power) {
    const rads = toRadians(degrees);
    const impulse = new b2Vec2(Math.cos(rads) * power, Math.sin(rads) * power);
    const point = body.GetWorldCenter();

    body.ApplyForce(impulse, point);
}

/*
 * Calculate the angle in degrees between both elements.
 */
export function calculateAngleBetweenObjects(
    objectA: GameElement,
    objectB: GameElement
) {
    const aX = objectA.getX();
    const aY = objectA.getY();

    const bX = objectB.getX();
    const bY = objectB.getY();

    const angleRadians = calculateAngle(aX, aY, bX, bY);

    return toDegrees(angleRadians);
}

export function outOfBounds(object: GameElement) {
    const width = CANVAS.width;
    const height = CANVAS.height;

    const x = object.getX();
    const y = object.getY();

    if (x < 0 || x > width || y < 0 || y > height) {
        return true;
    }

    return false;
}

export function boolToOnOff(value: boolean) {
    if (value === true) {
        return "On";
    } else {
        return "Off";
    }
}

/**
 * Show an HTML element.
 */
export function showElement(elementOrID: HTMLElement | string) {
    if (typeof elementOrID === "string") {
        elementOrID = document.getElementById(elementOrID)!;
    }

    elementOrID.classList.remove("hidden");
}

/**
 * Hide an HTML element.
 */
export function hideElement(elementOrID: HTMLElement | string) {
    if (typeof elementOrID === "string") {
        elementOrID = document.getElementById(elementOrID)!;
    }

    elementOrID.classList.add("hidden");
}
