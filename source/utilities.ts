import { CANVAS, b2Vec2 } from './main.js'


export const EVENT_KEY = {

    backspace  : 8,
    tab        : 9,
    enter      : 13,
    esc        : 27,
    space      : 32,
    end        : 35,
    home       : 36,
    leftArrow  : 37,
    upArrow    : 38,
    rightArrow : 39,
    downArrow  : 40,
    del        : 46,

    "0" : 48,
    "1" : 49,
    "2" : 50,
    "3" : 51,
    "4" : 52,
    "5" : 53,
    "6" : 54,
    "7" : 55,
    "8" : 56,
    "9" : 57,

    a : 65,
    b : 66,
    c : 67,
    d : 68,
    e : 69,
    f : 70,
    g : 71,
    h : 72,
    i : 73,
    j : 74,
    k : 75,
    l : 76,
    m : 77,
    n : 78,
    o : 79,
    p : 80,
    q : 81,
    r : 82,
    s : 83,
    t : 84,
    u : 85,
    v : 86,
    w : 87,
    x : 88,
    y : 89,
    z : 90,

    f1  : 112,
    f2  : 113,
    f3  : 114,
    f4  : 115,
    f5  : 116,
    f6  : 117,
    f7  : 118,
    f8  : 119,
    f9  : 120,
    f10 : 121,
    f11 : 122,
    f12 : 123

};


export function getRandomInt( min, max )
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandomFloat( min, max )
{
return Math.random() * (max - min) + min;
}


/**
 * Centers an html element in the middle of a given reference element (assumes html element has in its css 'position: absolute;').
 * If 'refElement' isn't given, its assumed to be the 'CANVAS'.
 */
export function centerElement( element, refElement? )
{
if ( typeof refElement === 'undefined' )
    {
    refElement = CANVAS;
    }

var width = $( refElement ).width();
var height = $( refElement ).height();

    // the reference element may not be starting at 0,0 position, so we need to account for that
var canvasPosition = $( refElement ).position();

var left = width / 2 - $( element ).width() / 2 + canvasPosition.left;
var top = height / 2 - $( element ).height() / 2 + canvasPosition.top;

$( element ).css({
    top  : top  + 'px',
    left : left + 'px'
    });
}


/*
 * Used for 'class' inheritance (search prototypal inheritance)
 */
function OBJECT (o)
{
function F(){}

F.prototype = o;

return new F();
}


/*
 * Used for 'class' inheritance (search for parasitic combination inheritance)
 */

function INHERIT_PROTOTYPE (derivedClass, baseClass)
{
var prototype = OBJECT( baseClass.prototype );

prototype.constructor = derivedClass;

derivedClass.prototype = prototype;
}



/*
 Applies an impulse to a body (box2d)
 */

export function applyImpulse( body, degrees, power )
{
var rads = toRadians( degrees );

var impulse = new b2Vec2( Math.cos( rads ) * power,
    Math.sin( rads ) * power );

var point = body.GetWorldCenter();

body.ApplyImpulse( impulse, point );
}

/*
    Applies a force to a body (box2d)
 */

export function applyForce( body, degrees, power )
{
var rads = toRadians( degrees );

var impulse = new b2Vec2( Math.cos( rads ) * power, Math.sin( rads ) * power );

var point = body.GetWorldCenter();

body.ApplyForce( impulse, point );
}



/*
    objectA and objectB has to have a .getX() and .getY() method
 */

export function calculateAngleBetweenObjects( objectA, objectB )
{
var aX = objectA.getX();
var aY = objectA.getY();

var bX = objectB.getX();
var bY = objectB.getY();

return calculateAngleBetweenObjects2( aX, aY, bX, bY );
}

/*
    Called with the x/y directly
 */

function calculateAngleBetweenObjects2( aX, aY, bX, bY )
{
    // make a triangle from the position the objectA is in, relative to the objectB position
var triangleOppositeSide = aY - bY;
var triangleAdjacentSide = bX - aX;

    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );

    // convert to degrees
var angleDegrees = angleRadians * 180 / Math.PI;

return angleDegrees;
}


export function toRadians( degrees )
{
return degrees * Math.PI / 180;
}


export function toDegrees( radians )
{
return radians * 180 / Math.PI;
}


export function outOfBounds( object )
{
var width = CANVAS.width;
var height = CANVAS.height;

var x = object.getX();
var y = object.getY();

if ( x < 0 || x > width || y < 0 || y > height )
    {
    return true;
    }

return false;
}


export function boolToOnOff( value )
{
if ( value == true )
    {
    return 'On';
    }

else
    {
    return 'Off';
    }
}
