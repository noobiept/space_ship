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

/*global MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{
    // keys being pressed/held
var KEYS_HELD = {

    left  : false,
    right : false,
    up    : false,
    down  : false 
    
    };

var shootHeld;  //HERE
    
    
function clearKeysHeld()
{
KEYS_HELD.left = false;
KEYS_HELD.right = false;
KEYS_HELD.up = false;
KEYS_HELD.down = false;
}
    

function handleKeyDown( event ) 
{
if( !event )
    {
    event = window.event; 
    }
    
    
    // don't do anything when the menu is opened
if ( GameMenu.isOpened() )
    {
    return;
    }
    
switch(event.keyCode) 
    {
    case EVENT_KEY.space:	//HERE use for secondary fire or something
        
        shootHeld = true; 
        return false;
        
    case EVENT_KEY.a:
    case EVENT_KEY.leftArrow:	
        
        KEYS_HELD.left = true; 
        return false;
        
    case EVENT_KEY.d:
    case EVENT_KEY.rightArrow: 
    
        KEYS_HELD.right = true; 
        return false;
        
    case EVENT_KEY.w:
    case EVENT_KEY.upArrow:	
    
        KEYS_HELD.up = true; 
        return false;
        
    case EVENT_KEY.s:
    case EVENT_KEY.downArrow:
    
        KEYS_HELD.down = true;
        return false;
    }
}




function handleKeyUp( event )
{
if ( !event )
    {
    event = window.event; 
    }
    
    // don't do anything when the menu is opened
if ( GameMenu.isOpened() )
    {
    return;
    }
    
switch(event.keyCode) 
    {
    case EVENT_KEY.space:	
        
        shootHeld = false; 
        break;
        
    case EVENT_KEY.a:
    case EVENT_KEY.leftArrow:	
        
        KEYS_HELD.left = false; 
        break;
        
    case EVENT_KEY.d:
    case EVENT_KEY.rightArrow: 
    
        KEYS_HELD.right = false; 
        break;
        
    case EVENT_KEY.w:
    case EVENT_KEY.upArrow:	
        
        KEYS_HELD.up = false; 
        break;
        
    case EVENT_KEY.s:
    case EVENT_KEY.downArrow:
    
        KEYS_HELD.down = false;
        break;
        
    case EVENT_KEY["1"]:
        
        MAIN_SHIP.selectWeapon( 1 );
        break;
        
    case EVENT_KEY["2"]:
    
        MAIN_SHIP.selectWeapon( 2 );
        break;
        
    case EVENT_KEY["3"]:
        
        MAIN_SHIP.selectWeapon( 3 );
        break;
        
    case EVENT_KEY["4"]:
    
        MAIN_SHIP.selectWeapon( 4 );
        break;
    }
}


    // make functions available outside
window.handleKeyDown = handleKeyDown;
window.handleKeyUp = handleKeyUp;
window.clearKeysHeld = clearKeysHeld;

window.KEYS_HELD = KEYS_HELD;
window.EVENT_KEY = EVENT_KEY;

}(window));
