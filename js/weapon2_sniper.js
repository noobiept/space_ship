/*global Bullets*/
/*jslint vars:true, white: true*/

"use strict";


function Weapon2_sniper( shipObject )
{
    // inherit from the Bullets class
Bullets.call( this, shipObject );

this.speed = 40; //HERE ser instantaneo?...
} 


    // inherit the member functions
INHERIT_PROTOTYPE( Weapon2_sniper, Bullets );


Weapon2_sniper.prototype.drawBullet = function()
{
    //HERE por a fazer load de uma imagem
};
