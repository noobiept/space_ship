(function(window)
{
/*
    Argument:
        {
            text: string,
            x: number,
            y: number,
            cssClass: string
        }
 */

function Message( stuff )
{
var container = document.querySelector( '#Message-container' );

var message = document.createElement( 'div' );

message.className = 'Message';

$( message ).html( stuff.text );


if ( typeof stuff.x == 'undefined' )
    {
    centerElement( message );
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


container.appendChild( message );

this.container = container;
this.message = message;
}


Message.prototype.setText = function( text )
{
$( this.message ).html( text );
};



Message.prototype.remove = function()
{
this.container.removeChild( this.message );
};



window.Message = Message;


}(window));
