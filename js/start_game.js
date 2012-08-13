


(function(window)
{




function StartGame() 
{
GAME_MODE = StartGame;

initGame();

Maps();

Ticker.addListener( Maps.tick );
}




StartGame.tick = function()
{

};



window.StartGame = StartGame;

}(window));