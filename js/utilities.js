/*
    Copyright - 2012 - Pedro Ferreira

    This file is part of space_ship_game.

    space_ship_game is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    space_ship_game is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with space_ship_game.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global */
/*jslint vars: true, white: true*/

"use strict";


function getRandomInt( min, max )  
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomFloat( min, max )
{
return Math.random() * (max - min) + min;
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

function applyImpulse( body, degrees, power )
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

function applyForce( body, degrees, power )
{
var rads = toRadians( degrees );

var impulse = new b2Vec2( Math.cos( rads ) * power, Math.sin( rads ) * power );

var point = body.GetWorldCenter();

body.ApplyForce( impulse, point );
}



/*
    objectA and objectB has to have a .getX() and .getY() method
 */

function calculateAngleBetweenObjects( objectA, objectB )
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



function toRadians( degrees )
{
return degrees * Math.PI / 180;
}


function toDegrees( radians )
{
return radians * 180 / Math.PI;
}
