import {
    toRadians,
    calculateAngle,
    toDegrees,
    getRandomInt,
} from "@drk4/utilities";
import { CANVAS } from "../main";
import { b2Vec2, EnemyClasses, EnemyNames } from "./constants";
import { GameElement } from "./types";
import { getMusicVolume } from "./options";

/**
 * Centers an html element in the middle of a given reference element (assumes html element has in its css 'position: absolute;').
 * If 'refElement' isn't given, its assumed to be the 'CANVAS'.
 */
export function centerElement(element: HTMLElement, refElement?: HTMLElement) {
    const reference = refElement ?? CANVAS;

    // the reference element may not be starting at 0,0 position, so we need to account for that
    const refRect = reference.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const width = refRect.width;
    const height = refRect.height;

    const left = width / 2 - elementRect.width / 2 + refRect.left;
    const top = height / 2 - elementRect.height / 2 + refRect.top;

    element.style.top = top + "px";
    element.style.left = left + "px";
}

/**
 *  Center the canvas in the middle of window.
 */
export function centerCanvas(canvasElement: HTMLCanvasElement) {
    const left = window.innerWidth / 2 - canvasElement.width / 2;
    const top = window.innerHeight / 2 - canvasElement.height / 2;

    canvasElement.style.left = left + "px";
    canvasElement.style.top = top + "px";
}

/**
 * Applies an impulse to a body (box2d).
 */
export function applyImpulse(
    body: Box2D.Dynamics.b2Body,
    degrees: number,
    power: number
) {
    const rads = toRadians(degrees);
    const impulse = new b2Vec2(Math.cos(rads) * power, Math.sin(rads) * power);
    const point = body.GetWorldCenter();

    body.ApplyImpulse(impulse, point);
}

/**
 * Applies a force to a body (box2d).
 */
export function applyForce(
    body: Box2D.Dynamics.b2Body,
    degrees: number,
    power: number
) {
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

/**
 * Play a sound from an existing audio element.
 */
export function playSound(id: string) {
    const volume = getMusicVolume();
    const music = document.getElementById(id) as HTMLAudioElement;
    music.currentTime = 0;
    music.volume = volume;
    music.play();
}

/**
 * Get a random enemy class.
 */
export function getRandomEnemy() {
    const position = getRandomInt(0, EnemyClasses.length - 1);

    return {
        name: EnemyNames[position],
        class: EnemyClasses[position],
    };
}
