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
    
    

switch(event.keyCode) 
    {
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
    

switch(event.keyCode) 
    {
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
        
        MAIN_SHIP.selectWeapon( 0 );
        break;
        
    case EVENT_KEY["2"]:
    
        MAIN_SHIP.selectWeapon( 1 );
        break;
        
    case EVENT_KEY["3"]:
        
        MAIN_SHIP.selectWeapon( 2 );
        break;
        
    case EVENT_KEY["4"]:
    
        MAIN_SHIP.selectWeapon( 3 );
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
