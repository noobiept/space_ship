import { centerElement } from "./utilities.js";

const ALL_MESSAGES = [];

/*
    Argument:
        {
            text: string,
            x: number,             ( optional )
            y: number,             ( optional )
            centerWindow: boolean, ( optional ) -- if x/y isn't provided, specify whether to center in the middle of the canvas or the window (default is canvas).
            cssClass: string,      ( optional ) -- adds a css class to the html element
            timeOut: number        ( optional ) -- the message is removed after this time (in milliseconds) has passed (otherwise it has to be removed manually)
            timeOut_f: function    ( optional ) -- to be called when timeout ends
        }

    If x/y isn't provided, the message is centered in the middle of the canvas
 */

export default class Message
{
private message: HTMLElement;
private container: HTMLElement; //HERE not used?

constructor( stuff )
    {
    const container = document.getElementById( 'Message-container' );
    const message = document.createElement( 'div' );

    message.className = 'Message';

    $( message ).html( stuff.text );
    container.appendChild( message );

    if ( typeof stuff.x == 'undefined' )
        {
        if ( stuff.centerWindow === true )
            {
            centerElement( message, document.body );
            }

        else
            {
            centerElement( message );
            }
        }

    else
        {
        $( message ).css( 'left', stuff.x + 'px' );
        $( message ).css( 'top', stuff.y + 'px' );
        }


    if ( typeof stuff.cssClass != 'undefined' )
        {
        $( message ).addClass( stuff.cssClass );
        }


    if ( typeof stuff.timeOut !== 'undefined' )
        {
        window.setTimeout( () =>
            {
            this.remove();

            if ( stuff.timeOut_f )
                {
                stuff.timeOut_f();
                }

            }, stuff.timeOut );
        }


    this.container = container;
    this.message = message;

    ALL_MESSAGES.push( this );
    }


setText( text )
    {
    $( this.message ).html( text );
    }

remove()
    {
    $( this.message ).remove();

    var position = ALL_MESSAGES.indexOf( this );

    ALL_MESSAGES.splice( position, 1 );
    }

static removeAll()
{
for (var i = 0 ; i < ALL_MESSAGES.length ; i++)
    {
    ALL_MESSAGES[ i ].remove();

    i--;
    }
}
}



