/*global MAIN_SHIP*/
/*jslint vars: true, white: true*/

"use strict";

(function(window) 
{

/*
 * Keys code for the keyboard events
 */

var EVENT_KEY = {

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
    f12 : 123
    
};


    // keys being pressed/held
var KEYS_HELD = {

    left  : false,
    right : false,
    up    : false,
    down  : false 
    
    };

var shootHeld;  //HERE
    

function handleKeyDown( event ) 
{
if( !event )
    {
    event = window.event; 
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

window.KEYS_HELD = KEYS_HELD;
window.EVENT_KEY = EVENT_KEY;

}(window));
