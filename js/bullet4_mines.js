"use strict";

(function(window)
{
    // remove the mines after some time
var REMOVE_TICK = 250;

    // rotate the mine
var ANGLE_TICK = 15;


function Bullet4_mines( shipObject, color, angleRotation )
{
this.width = 15;
this.height = 15;
this.color = color;

angleRotation = 0;  // doesn't need the rotation

    // inherit from the Bullet class
Bullet.call( this, shipObject, angleRotation );

this.speed = 0;
this.damage = 50;

    // count the ticks, and when it reaches 0 remove the mine
this.countTick = REMOVE_TICK;

    // angle of the mine points (for the animation, keep rotating the mine)
this.angle = 0;

this.angleTick = ANGLE_TICK;
}


    // inherit the member functions
INHERIT_PROTOTYPE( Bullet4_mines, Bullet );


Bullet4_mines.prototype.drawBullet = function( angleRotation )
{
var width = this.width;
var height = this.height;

var mine = new createjs.Shape();

mine.regX = width / 2;
mine.regY = height / 2;
mine.rotation = angleRotation;

var g = mine.graphics;

var halfPoint = width / 2;  // width is same as height

g.beginFill( this.color );
g.drawPolyStar( halfPoint, halfPoint, halfPoint, 5, 0.5, this.angle );
g.drawCircle( halfPoint, halfPoint, 4 / 6 * halfPoint );


this.shape = mine;
};


/*
    Have an animation of the mine (rotates around itself)
 */

Bullet4_mines.prototype.rotateMine = function()
{
this.angle += 45;

if (this.angle > 360)
    {
    this.angle = 0;
    }

var mine = this.shape;

var g = mine.graphics;

var halfPoint = this.width / 2;  // width is same as height

g.clear();
g.beginFill( this.color );
g.drawPolyStar( halfPoint, halfPoint, halfPoint, 5, 0.5, this.angle );
g.drawCircle( halfPoint, halfPoint, 4 / 6 * halfPoint );

this.angleTick = ANGLE_TICK;
};


/*
    What to do to the bullet when a collision is detected
 */

Bullet4_mines.prototype.collisionResponse = function()
{
this.remove();

new SplashDamage( this.shipObject, this.getX(), this.getY(), 40, this.color, 40 );
};



Bullet4_mines.prototype.tick_function = function()
{
this.countTick--;
this.angleTick--;

    // remove the mine after some time (so that it doesn't stay there forever
if ( this.countTick < 0 )
    {
    this.remove();
    }

else if ( this.angleTick < 0 )
    {
    this.rotateMine();
    }
};


window.Bullet4_mines = Bullet4_mines;

}(window));
