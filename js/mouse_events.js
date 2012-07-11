/*global CANVAS, Bullets, STAGE*/
/*jslint vars: true, white: true, newcap: true*/

"use strict";

/*
    Arguments:
    
        event : (MouseEvent -- easelJS)
        ship  : (Ship object)
 */

function handleMouseMove( event, ship )
{
if ( !event )
    {
    event = window.event;
    }



    // make a triangle from the position the ship is in, relative to the mouse position
var triangleOppositeSide = ship.y - event.stageY;
var triangleAdjacentSide = event.stageX - ship.x;


    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );

    // convert to degrees
var angleDegrees = angleRadians * 180 / Math.PI;



    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
ship.rotation = -1 * angleDegrees;   
}





function handleClick( event, ship )
{
if ( !event )
    {
    event = window.event;
    }

    
new Bullets( ship, STAGE );    
}