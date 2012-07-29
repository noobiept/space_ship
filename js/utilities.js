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



