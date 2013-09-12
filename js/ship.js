"use strict";

(function(window) 
{

function Ship()
{
this.shape = null;

this.width = 10;
this.height = 10;
this.color = 'rgb(81, 139, 255)';

this.type = TYPE_SHIP;

this.makeShape();

this.setupPhysics();


this.weaponSelected = 0;

    // counter, until it can add a new ammo to the weapon
this.tick_count = [
    AMMO_UPDATE_TICK[ 0 ],
    AMMO_UPDATE_TICK[ 1 ],
    AMMO_UPDATE_TICK[ 2 ],
    AMMO_UPDATE_TICK[ 3 ]
    ];

    // current number of bullets left
this.bullets_left = [
        parseInt( MAX_AMMO[ 0 ] / 2 ),
        parseInt( MAX_AMMO[ 1 ] / 2 ),
        parseInt( MAX_AMMO[ 2 ] / 2 ),
        parseInt( MAX_AMMO[ 3 ] / 2 )
    ];


Ship.all.push( this );

this.moveTo( GAME_WIDTH / 2, GAME_HEIGHT / 2 );

STAGE.addChild( this.shape );

ZIndex.add( this.shape );

this.setEvents();
}


Ship.all = [];


var VELOCITY = 5;


    // ticks until we add + ammo to the weapons
    // the weapon number corresponds to the position in the list (position 0 is the first weapon, etc)
var AMMO_UPDATE_TICK = [
    10,
    32,
    15,
    25
    ];


    // maximum number of bullets per weapon
var MAX_AMMO = [
        50,
        10,
        25,
        20
    ];




Ship.prototype.makeShape = function()
{
var spriteSheet = {
    animations: {
        main: {
            frames: [ 0 ],
            next: "main"
            }
        },
    frames: {
        width: 10,
        height: 10
        },
    images: [ PRELOAD.getResult( 'ship' ) ]
    };


var ss = new createjs.SpriteSheet( spriteSheet );

var ship = new createjs.BitmapAnimation( ss );

ship.gotoAndPlay("main");

    // change the origin point to the middle, so that it rotates around the center (following the mouse)
ship.regX = this.width / 2;
ship.regY = this.height / 2;

this.shape = ship;
};
 

Ship.prototype.setupPhysics = function()
{
var width = this.width;
var height = this.height;

    // physics
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.filter.categoryBits = CATEGORY.ship;
fixDef.filter.maskBits = MASK.ship;

this.category_bits = CATEGORY.ship;
this.mask_bits = MASK.ship;


var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_staticBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2CircleShape( width / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );

this.body = body;

body.SetUserData( this );
};



(function(Ship)
{
var CLICK_F = null;
var MOUSE_MOVE_F = null;

/*
    Sets Ship's events, that handle the firing of the weapons (click event) and the rotation of the ship (mousemove event)
 */

Ship.prototype.setEvents = function()
{
var shipObject = this;

CLICK_F = function( event ) { shipObject.handleClick( event ); };
MOUSE_MOVE_F = function( event ) { shipObject.handleMouseMove( event ); };

window.addEventListener( 'click', CLICK_F, false );
window.addEventListener( 'mousemove', MOUSE_MOVE_F, false );
};


/*
    Clear the events of the Ship, call .setEvents() later to set them back
 */

Ship.prototype.clearEvents = function()
{
window.removeEventListener( 'click', CLICK_F );
window.removeEventListener( 'mousemove', MOUSE_MOVE_F );
};

}(Ship));




/*
    Updates the shape position to match the physic body
 */

Ship.prototype.updateShape = function()
{
this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


Ship.prototype.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};


Ship.prototype.getX = function()
{
return this.shape.x;
};


Ship.prototype.getY = function()
{
return this.shape.y;
};


Ship.prototype.getRotation = function()
{
return this.shape.rotation;
};


Ship.inTopLimit = function( y )
{
if (y < 0)
    {
    return true;
    }

return false;
};
 
 

Ship.inLeftLimit = function( x )
{
if (x < 0)
    {
    return true;
    }

return false;
};


Ship.inRightLimit = function( x )
{
if (x > GAME_WIDTH)
    {
    return true;
    }

return false;
};
 


Ship.inBottomLimit = function( y )
{
if (y > GAME_HEIGHT)
    {
    return true;
    }

return false;
};



Ship.prototype.tookDamage = function( damage )
{
var energy = GameStatistics.getShipEnergy() - damage;

GameStatistics.updateShipEnergy( energy );


    // you loose
if (energy <= 0)
    {
    this.remove();
        
    createjs.Ticker.removeAllListeners();
    window.onclick = null;  // so that you can't fire anymore


    var endMessage = new Message({
        text: "Game Over: Press enter to restart"
        });
    
    $( document ).bind( "keyup", function(event)
        {
        if (event.keyCode === EVENT_KEY.enter) 
            {
            endMessage.remove();

            startGameMode( true );
            }
        });
    }
};
    
    
Ship.prototype.selectWeapon = function( weaponNumber )
{
this.weaponSelected = weaponNumber;

GameMenu.selectWeapon( weaponNumber );
};
    

/*
    Arguments:
    
        event : (MouseEvent -- easelJS)
        ship  : (Ship object)
 */
    
Ship.prototype.handleMouseMove = function( event )
{
if ( !event )
    {
    event = window.event;
    }

var canvasPosition = $( CANVAS ).position();

    // mouse position in the canvas (assume origin point in top/left of canvas element)
var mouseX = event.pageX - canvasPosition.left;
var mouseY = event.pageY - canvasPosition.top;

    // make a triangle from the position the ship is in, relative to the mouse position
var triangleOppositeSide = this.shape.y - mouseY;
var triangleAdjacentSide = mouseX - this.shape.x;


    // find the angle, given the two sides (of a right triangle)
var angleRadians = Math.atan2( triangleOppositeSide, triangleAdjacentSide );

    // convert to degrees
var angleDegrees = angleRadians * 180 / Math.PI;

    // we multiply by -1 because the .rotation property seems to have the angles in the other direction
this.rotate( -1 * angleDegrees );
};
    
    
Ship.prototype.rotate = function( degrees )
{
this.shape.rotation = degrees;

this.body.SetAngle( degrees * Math.PI / 180 );
};


    
Ship.prototype.handleClick = function( event )  
{
if ( !event )
    {
    event = window.event;
    }

    
var weapons = [ Bullet1_laser, Bullet2_sniper, Bullet3_rocket, Bullet4_mines ];


var weaponSelected = this.weaponSelected;
var bulletsLeft = this.bullets_left;


if (bulletsLeft[ weaponSelected ] > 0)
    {
    new weapons[ this.weaponSelected ]( this, this.color );
    
    bulletsLeft[ weaponSelected ]--;
    
    GameStatistics.updateBulletsLeft( weaponSelected );
    }
};
    

    
    
    
Ship.prototype.updateAmmo = function()
{
var i;
var tickCount = this.tick_count;
var bulletsLeft = this.bullets_left;

for (i = 0 ; i < AMMO_UPDATE_TICK.length ; i++)
    {
    tickCount[ i ]--;
    
    if (tickCount[ i ] <= 0)
        {
            // reset the counter
        tickCount[ i ] = AMMO_UPDATE_TICK[ i ];
        
            // if we still didn't reach the maximum value
        if (bulletsLeft[ i ] < MAX_AMMO[ i ])
            {
                // increase the number of bullets available
            bulletsLeft[ i ]++;
            
            GameStatistics.updateBulletsLeft( i );
            }
        }
    }
};

/*
    Returns the number of bullets left from a particular weapon (zero-based)
 */

Ship.prototype.getBulletsLeft = function( weapon )
{
return this.bullets_left[ weapon ];
};
    
    
/* 
    Remove this ship
 */
    
Ship.prototype.remove = function()
{
createjs.Ticker.removeListener( this );
STAGE.removeChild( this.shape );

WORLD.DestroyBody( this.body );

var position = Ship.all.indexOf( this );

Ship.all.splice( position, 1 );

$( this ).unbind();
this.clearEvents();
};


/*
    Remove all the ships
 */

Ship.removeAll = function()
{
$( Ship.all ).each(function(index, value)
    {
    value.remove();
    });
};
 
 

    
    
Ship.prototype.tick = function()
{
var nextX, nextY;

    // top left
if (KEYS_HELD.left && KEYS_HELD.up)
    {
    nextX = this.shape.x - VELOCITY;
    nextY = this.shape.y - VELOCITY;

    if ( Ship.inTopLimit( nextY ) )
        {
        nextY = this.shape.y;
        }
    
    if ( Ship.inLeftLimit( nextX ) )
        {
        nextX = this.shape.x;
        }

    this.moveTo( nextX, nextY );
    }
    
    // bottom left
else if (KEYS_HELD.left && KEYS_HELD.down)
    {
    nextX = this.shape.x - VELOCITY;
    nextY = this.shape.y + VELOCITY;
    
    if ( Ship.inLeftLimit( nextX ) )
        {
        nextX = this.shape.x;
        }
        
    if ( Ship.inBottomLimit( nextY ) )
        {
        nextY = this.shape.y;
        }

    this.moveTo( nextX, nextY );
    }
    
    // top right
else if (KEYS_HELD.right && KEYS_HELD.up)
    {
    nextX = this.shape.x + VELOCITY;
    nextY = this.shape.y - VELOCITY;
    
    if ( Ship.inRightLimit( nextX ) )
        {
        nextX = this.shape.x;
        }
        
    if ( Ship.inTopLimit( nextY ) )
        {
        nextY = this.shape.y;
        }

    this.moveTo( nextX, nextY );
    }
    
    // bottom right
else if (KEYS_HELD.right && KEYS_HELD.down)
    {
    nextX = this.shape.x + VELOCITY;
    nextY = this.shape.y + VELOCITY;
    
    if ( Ship.inRightLimit( nextX ) )
        {
        nextX = this.shape.x;
        }
        
    if ( Ship.inBottomLimit( nextY ) )
        {
        nextY = this.shape.y;
        }

    this.moveTo( nextX, nextY );
    }

    // left
else if(KEYS_HELD.left)
    {
    nextX = this.shape.x - VELOCITY;
    
    if ( Ship.inLeftLimit( nextX ) )
        {
        nextX = this.shape.x;
        }

    this.moveTo( nextX, this.shape.y );
    }
    
    // right
else if (KEYS_HELD.right)
    {
    nextX = this.shape.x + VELOCITY;
    
    if ( Ship.inRightLimit( nextX ) )
        {
        nextX = this.shape.x;
        }

    this.moveTo( nextX, this.shape.y );
    }
    
    // top
else if (KEYS_HELD.up)
    {
    nextY = this.shape.y - VELOCITY;
    
        // check if is within the canvas (in bounds)
    if ( Ship.inTopLimit( nextY ) )
        {
        nextY = this.shape.y;
        }

    this.moveTo( this.shape.x, nextY );
    }
    
    // bottom
else if (KEYS_HELD.down)
    {
    nextY = this.shape.y + VELOCITY;
    
    if ( Ship.inBottomLimit( nextY ) )
        {
        nextY = this.shape.y;
        }

    this.moveTo( this.shape.x, nextY );
    }

    
this.updateShape();

this.updateAmmo();
};

    
window.Ship = Ship;

}(window));

