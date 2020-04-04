import { toRadians } from "@drk4/utilities";
import { CANVAS } from "../main";
import { b2Vec2 } from "./constants";

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
    var rads = toRadians(degrees);

    var impulse = new b2Vec2(Math.cos(rads) * power, Math.sin(rads) * power);

    var point = body.GetWorldCenter();

    body.ApplyImpulse(impulse, point);
}

/**
 * Applies a force to a body (box2d).
 */
export function applyForce(body, degrees, power) {
    var rads = toRadians(degrees);

    var impulse = new b2Vec2(Math.cos(rads) * power, Math.sin(rads) * power);

    var point = body.GetWorldCenter();

    body.ApplyForce(impulse, point);
}

/*
    objectA and objectB has to have a .getX() and .getY() method
 */

export function calculateAngleBetweenObjects(objectA, objectB) {
    var aX = objectA.getX();
    var aY = objectA.getY();

    var bX = objectB.getX();
    var bY = objectB.getY();

    return calculateAngleBetweenObjects2(aX, aY, bX, bY);
}

/*
    Called with the x/y directly
 */

function calculateAngleBetweenObjects2(aX, aY, bX, bY) {
    // make a triangle from the position the objectA is in, relative to the objectB position
    var triangleOppositeSide = aY - bY;
    var triangleAdjacentSide = bX - aX;

    // find the angle, given the two sides (of a right triangle)
    var angleRadians = Math.atan2(triangleOppositeSide, triangleAdjacentSide);

    // convert to degrees
    var angleDegrees = (angleRadians * 180) / Math.PI;

    return angleDegrees;
}

export function outOfBounds(object) {
    var width = CANVAS.width;
    var height = CANVAS.height;

    var x = object.getX();
    var y = object.getY();

    if (x < 0 || x > width || y < 0 || y > height) {
        return true;
    }

    return false;
}

export function boolToOnOff(value) {
    if (value == true) {
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
        elementOrID = document.getElementById(elementOrID);
    }

    elementOrID.classList.remove("hidden");
}

/**
 * Hide an HTML element.
 */
export function hideElement(elementOrID: HTMLElement | string) {
    if (typeof elementOrID === "string") {
        elementOrID = document.getElementById(elementOrID);
    }

    elementOrID.classList.add("hidden");
}
