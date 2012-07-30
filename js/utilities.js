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



