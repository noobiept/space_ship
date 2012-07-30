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

/*global $, STAGE*/
/*jslint vars: true, white: true*/

"use strict";

/*
    Keep these elements on top (last ones being added to stage)
 */

var ZIndex = {

    elements: []

};


ZIndex.add = function( element )
{
ZIndex.elements.push( element );
};


/*
    Remove an element (just from being pushed to the top, doesn't remove it from the Stage)
 */

ZIndex.remove = function( element )
{
var position = ZIndex.elements.indexOf( element );

ZIndex.elements.splice( position, 1 );
};

/*
    Remove everything
 */

ZIndex.clear = function()
{
ZIndex.elements.length = 0;
};


ZIndex.update = function()
{
$( ZIndex.elements ).each(function(index, element)
    {
        // by re-adding the element, it goes to the 'top' of the canvas (is drawn last)
    STAGE.addChild( element );
    });
};

