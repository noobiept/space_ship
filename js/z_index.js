/*global STAGE*/
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

