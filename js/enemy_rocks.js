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

/*global EnemyShip, INHERIT_PROTOTYPE*/
/*jslint vars: true, white: true*/

"use strict";

/*
    Arguments:
    
        scale: scale the original image (1 -> 100%, no scaling)
 */

function EnemyRocks( scale )
{
this.shape = null;

this.damage = EnemyRocks.damage;
this.velocity = EnemyRocks.velocity;

this.width = 50;
this.height = 50;

if (typeof scale != "undefined" && $.isNumeric( scale ))
    {
    this.scale = scale;
    }

else
    {
    this.scale = 1;
    }

    // inherits from the EnemyShip class
EnemyShip.call( this );
}


    // inherit the member functions
INHERIT_PROTOTYPE( EnemyRocks, EnemyShip );


EnemyRocks.damage = 5;
EnemyRocks.velocity = 1;



EnemyRocks.prototype.makeShape = function()
{
var spriteConfig = {
    animations: {
        spawn: {
            frames: [ 0, 1, 2 ],
            next: "spawn",
            frequency: 10
            },
        main: {
            frames: [ 3 ],
            next: "main",
            frequency: 10
            }
        },
    frames: {
        width: this.width,
        height: this.height
        },
    images: [ "images/enemy_rocks.png" ]
    };

var sprite = new SpriteSheet( spriteConfig );
    
var rock = new BitmapAnimation( sprite );

    // origin in the middle of the image
rock.regX = this.width / 2;
rock.regY = this.height / 2;

rock.scaleX = this.scale;
rock.scaleY = this.scale;

    // don't update these variables before the scaling (they're are used in the config above, and the scaling is applied later)
this.width *= this.scale;
this.height *= this.scale;

    // it moves 
this.angleRadians = getRandomFloat( 0, 2 * Math.PI );

rock.gotoAndPlay("spawn");

this.shape = rock;
};


//HERE mudar o nome para enemyBehaviour ou shapeBehaviour
EnemyRocks.prototype.shipBehaviour = function()
{
this.x += Math.sin( this.angleRadians ) * this.velocity;
this.y += Math.cos( this.angleRadians ) * this.velocity;
};


/*
    When it takes damage, create new smaller rocks
 */

EnemyRocks.prototype.damageTaken = function()
{
if (this.width >= 50)
    {
    var i;
    
    for (i = 0 ; i < 3 ; i++)
        {
        var rock = new EnemyRocks( 0.5 );
        
            // spawn from the current position
        rock.x = this.x;
        rock.y = this.y;
        
        addNewEnemy( rock );
        }
    }

this.remove();
};



