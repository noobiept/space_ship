/*global INHERIT_PROTOTYPE, EnemyShip*/
/*jslint vars: true, white: true*/

"use strict";



function EnemyMoveHorizontally()
{
    // inhirit from EnemyShip class
EnemyShip.call( this );

this.shipBody = null;

this.damage = 10;
this.velocity = 1;

this.width = 20;
this.height = 20;
}


    //inherit the member functions
INHERIT_PROTOTYPE( EnemyMoveHorizontally, EnemyShip);



EnemyMoveHorizontally.prototype.makeShape = function()
{
var g = this.shipBody.graphics;

g.clear();

g.beginStroke( "rgb(255, 0, 0)" );


g.moveTo( -10, -10 );
g.lineTo( 10, -10 );
g.lineTo( 10, 10 );
g.lineTo( -10, 10 );
g.lineTo( -10, -10 );

g.closePath();
};



EnemyMoveHorizontally.prototype.shipBehaviour = function()
{
this.x += this.velocity;
};


