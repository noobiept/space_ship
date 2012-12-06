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

/*global Shape, STAGE, CANVAS, ZIndex, Ticker, GAME_WIDTH, GAME_HEIGHT*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{

/*
    Use as base class for the weapons
    
    Functions to write (in derived class):
    
        .drawBullet()
        .setupPhysics()         (optional -- the default is a rectangle from the width/height properties)

    Properties:

        .width
        .height
        .damage
        .speed
        
    Add reference of the drawn element to:
    
        .shape
        
    Arguments:
    
        shipObject    : of the ship which fired the bullet
        angleRotation : of the bullet
 */

function Weapons( shipObject, angleRotation, x, y )
{
this.shape = null;

this.shipObject = shipObject;

if ( !$.isNumeric( angleRotation ) )
    {
    angleRotation = calculateAngleBetweenObjects2( MAIN_SHIP.getX(), MAIN_SHIP.getY(), STAGE.mouseX, STAGE.mouseY );
    }

angleRotation = -1 * angleRotation; //HERE

this.angleRotation = angleRotation;

this.type = TYPE_BULLET;

this.damage = 10;

    // draw the bullet
this.drawBullet( angleRotation );

this.setupPhysics();

this.isEnemy = shipObject.isEnemy;

STAGE.addChild( this.shape );

ZIndex.update();

createjs.Ticker.addListener( this );


if ( this.isEnemy )
    {
    Weapons.enemyBullets.push( this );
    }

else
    {
    Weapons.allyBullets.push( this );
    }



if ( typeof x === 'undefined')
    {
    x = shipObject.getX();
    y = shipObject.getY();
    }

    // fire from outside the main ship radius (so it doesn't collide immediately with it)
var shipRadius = MAIN_SHIP.width / 2;

var angle = this.angleRotation;

var radians = toRadians( angle );

var addX = Math.cos( radians ) * shipRadius;
var addY = Math.sin( radians ) * shipRadius;

this.moveTo( x + addX, y + addY );
}

    // all the bullets from the enemies
Weapons.enemyBullets = [];

    // all the bullets from the allies
Weapons.allyBullets = [];



Weapons.prototype.drawBullet = function( angleRotation )
{
    // do this
};



Weapons.prototype.setupPhysics = function()
{
var width = this.width;
var height = this.height;

    // physics
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;

bodyDef.position.x = 0;
bodyDef.position.y = 0;

fixDef.shape = new b2PolygonShape;

    // arguments: half width, half height
fixDef.shape.SetAsBox( width / 2 / SCALE, height / 2 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );

body.SetUserData( this );

this.body = body;
};




Weapons.prototype.getX = function()
{
return this.shape.x;
};


Weapons.prototype.getY = function()
{
return this.shape.y;
};


Weapons.prototype.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;

var position = new b2Vec2(x / SCALE, y / SCALE);

this.body.SetPosition( position );
};


Weapons.prototype.updateShape = function()
{
//this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

this.shape.x = this.body.GetWorldCenter().x * SCALE;
this.shape.y = this.body.GetWorldCenter().y * SCALE;
};


/*
    Tells if a bullet has reached the canvas limits
 */

Weapons.prototype.reachedLimits = function()
{
var x = this.shape.x;
var y = this.shape.y;

if (x < 0 || x > GAME_WIDTH || y < 0 || y > GAME_HEIGHT)
    {
    return true;
    }

return false;
};


/*
    How much damage the bullets gives to the ship when it hits
 */

Weapons.prototype.damageGiven = function()
{
return this.damage;
};


/*
    Remove the bullet from the stage
 */

Weapons.prototype.remove = function()
{
var all;

if ( this.isEnemy )
    {
    all = Weapons.enemyBullets;
    }
    
else
    {
    all = Weapons.allyBullets;
    }
    
STAGE.removeChild( this.shape );
createjs.Ticker.removeListener( this );


WORLD.DestroyBody( this.body );

var position = all.indexOf( this );

all.splice( position, 1 );
};


/*
    Remove all bullets 
 */

Weapons.removeAllBullets = function()
{
$( Weapons.enemyBullets ).each(function(index, enemy)
    {
    enemy.remove();
    });
    
$( Weapons.allyBullets ).each(function(index, ally)
    {
    ally.remove();
    });
};



Weapons.prototype.tick = function()
{
this.updateShape();

if (typeof this.tick_function !== "undefined" && this.tick_function !== null)
    {
    this.tick_function();
    }
};




    // public stuff
window.Weapons = Weapons;

}(window));
