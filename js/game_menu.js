

function GameMenu()
{
var menuButton = new Text("Menu", "14px Arial", "rgb(255, 255, 255)");


menuButton.x = 50;
menuButton.y = 50;

menuButton.onClick = function()
    {
    GameMenu.openMenu();
    };

STAGE.addChild( menuButton );
}


GameMenu.openMenu = function()
{
    // stop the game
Ticker.setPaused( true );

var background = new Shape();

var g = background.graphics;

g.beginFill( "rgba(255, 0, 0, 0.5)" );
g.rect( 40, 40, CANVAS.width - 40, CANVAS.height - 40 );

g.endFill();


var toggleMusic = new Text("Turn Off Music", "14px Arial", "rgb(255, 255, 255)");   //HERE por algo por tras do texto (ao clicar, tem k se acertar mm nas letras)

var musicOn = true;


toggleMusic.onClick = function()
    {
    if ( musicOn )
        {
        musicOn = false;
        
        SoundJS.pause();
        }
    
    else
        {
        musicOn = true;
        
        SoundJS.resume();
        }
    };

toggleMusic.x = 50;
toggleMusic.y = 50;
    
var backToGame = new Text("Back to Game", "14px Arial", "rgb(255, 255, 255)");

backToGame.onClick = function()
    {
    STAGE.removeChild( background );
    STAGE.removeChild( toggleMusic );
    STAGE.removeChild( backToGame );
    
    Ticker.setPaused( false );
    };

backToGame.x = toggleMusic.x;
backToGame.y = toggleMusic.y + 50;
    
STAGE.addChild( background );
STAGE.addChild( toggleMusic );
STAGE.addChild( backToGame );

STAGE.update();
};