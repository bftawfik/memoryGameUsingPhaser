var game;
var gameData = {};
var gameStates = {};
var addDefaultes = function(){
  gameData.margin = {
    v: 10,
    h: 10
  };
  gameData.startScreen = {
    width: 550,
    height: 550,
  }
  gameData.tilesData = {
    v: 6,
    h: 6,
    width: 80,
    height: 80,
    vs: 10,
    hs: 10
  };
  gameData.tilesArray=[];
  gameData.soundArray=[];
  gameData.selectedTiles=[];
  gameData.playSound = true;
  gameData.score = 0;
  gameData.timeLeft = null;
  gameData.tilesLeft = null;
  gameData.localStorageName = "bftawfik";
  gameData.highScore = null;
}
var createGameStates = function(){
  var preloadAssets = function(game){};
  preloadAssets.prototype = {
    preload: function(){
      game.load.spritesheet("startBtn0", "assets/imgs/startbtn0.jpg", gameData.startScreen.width, gameData.startScreen.height);
      game.load.spritesheet("soundBtn", "assets/imgs/Speaker.png", 75, 75);
      game.load.spritesheet("tiles", "assets/imgs/tiles.png", gameData.tilesData.width, gameData.tilesData.height);
      game.load.spritesheet("startScreenBg", "assets/imgs/startScreen.jpg", gameData.startScreen.width, gameData.startScreen.height);
      game.load.spritesheet("startBtn", "assets/imgs/startbtn.jpg", gameData.startScreen.width, gameData.startScreen.height);
      game.load.audio('select', 'assets/mp3/open.mp3');
      game.load.audio('right', 'assets/mp3/right.mp3');
      game.load.audio('wrong', 'assets/mp3/wrong.mp3');
    },
    create: function(){
      game.state.start('preStartScreen');
    }
  };
  var preStartScreen = function(game){};
  preStartScreen.prototype = {
    create: function(){
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.stage.disableVisibilityChange = true;
      var style = {
        font: "48px Arial",
        fill: "#00ff00",
        align: "center"
      }
      var text = game.add.text(game.width/2, (game.height/2) -100, "Memory Game", style);
      text.anchor.set(0.5);
      var startBtn0 = game.add.button(game.width/2, (game.height/2), 'startBtn0', this.startGame, this);
      startBtn0.anchor.set(0.5);
      var soundBtn = game.add.button(game.width/2, (game.height/2) +100, "soundBtn", this.switchSound, this);
      soundBtn.anchor.set(0.5);
      soundBtn.value = gameData.playSound;
    },
    startGame: function(target){
      console.log("startGame");
      game.state.start('startScreen');
    },
    switchSound:function(target){
      console.log("switchSound");
      gameData.playSound = !gameData.playSound;
      target.value = gameData.playSound;
      if(target.value){
        target.frame = 0;
      }else{
        target.frame = 1;
      }
    }
  };
  var startScreen = function(game){};
  startScreen.prototype = {
    create: function(){
      game.add.image(0, 0, 'startScreenBg');
      game.add.button(225, 300, 'startBtn', this.startGame, this);
    },
    startGame: function(target){
      game.state.start('playGame');
    }
  };
  var playGame = function(game){};
  playGame.prototype = {
    preload: function(){
      //
    },
    create: function(){
      gameData.timeLeft = 120;
      this.placeTiles();
      if(gameData.playSound){
        gameData.soundArray[0] = game.add.audio('select', 1);
        gameData.soundArray[1] = game.add.audio('right', 1);
        gameData.soundArray[2] = game.add.audio('wrong', 1);
      }
      var style = {
        font: "20px Arial",
        fill: "#FFFFFF",
        align: "center"
      }
      this.scoreText = game.add.text(game.width/2, game.height -20, "Score = "+gameData.score, style);
      this.scoreText.anchor.set(0.5);
      this.timeText = game.add.text(10, game.height -20, "Time Left = "+gameData.timeLeft, style);
      this.timeText.anchor.set(0, 0.5);
      game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this);
    },
    placeTiles: function(){
      gameData.tilesLeft = gameData.tilesData.h * gameData.tilesData.v;
      for(var i=0; i<gameData.tilesData.h * gameData.tilesData.v; i++){
        gameData.tilesArray.push(Math.floor(i/2));
      }
      for(var i=0; i<gameData.tilesArray.length; i++){
        var rndNo, tempTile;
        rndNo = game.rnd.between(0, gameData.tilesArray.length-1);
        tempTile = gameData.tilesArray[i];
        gameData.tilesArray[i] = gameData.tilesArray[rndNo];
        gameData.tilesArray[rndNo] = tempTile;
      }
      for(var j=0; j<gameData.tilesData.v; j++){
        for(var i=0; i<gameData.tilesData.h; i++){
          var x = gameData.margin.h + (i * (gameData.tilesData.width+gameData.tilesData.hs));
          var y = gameData.margin.v + (j * (gameData.tilesData.height+gameData.tilesData.vs));
          // game.add.image(x, y, 'tiles');
          var tile = game.add.button(x, y, 'tiles', this.btnClicked, this);
          tile.frame = 24;
          tile.value = gameData.tilesArray[(j*gameData.tilesData.h)+i];
          gameData.tilesArray.push(tile);
        }
      }
    },
    btnClicked: function(target){
      if(target.frame == 24){
        if(gameData.playSound){
          gameData.soundArray[0].play();
        }
        target.frame = target.value;
        gameData.selectedTiles.push(target);
        if(gameData.selectedTiles.length>1){
          // setTimeout(this.clearSelectedTiles,200);
          game.time.events.add(Phaser.Timer.QUARTER , this.clearSelectedTiles, this)
        }
      }
    },
    'clearSelectedTiles': function(){
      if(gameData.selectedTiles[0].value === gameData.selectedTiles[1].value){
        gameData.selectedTiles[0].destroy();
        gameData.selectedTiles[1].destroy();
        gameData.score += 100;
        this.scoreText.text = "Score"+ gameData.score;

        gameData.timeLeft += 2;
        gameData.timeLeft.text = "Time left: "+ gameData.timeLeft;

        if(gameData.playSound){
          gameData.soundArray[1].play();
        }

        gameData.tilesLeft -= 2;
        if(gameData.tilesLeft == 0){
          gameData.tilesArray=[];
          gameData.selectedTiles=[];
          this.placeTiles();
        }
      }else{
        gameData.selectedTiles[0].frame = 24;
        gameData.selectedTiles[1].frame = 24;
        if(gameData.playSound){
          gameData.soundArray[2].play();
        }
      }
      gameData.selectedTiles=[];
    },
    'decreaseTime': function(){
      gameData.timeLeft--;
      this.timeText.text = "Time Left = "+gameData.timeLeft;
      if(gameData.timeLeft == 0){
        console.log('hi');
        game.state.start('gameOver');
      }
    }
  }
  var gameOver = function(game){};
  gameOver.prototype = {
    create: function(){
      gameData.highScore = Math.max(gameData.score, gameData.highScore);
      localStorage.setItem(gameData.localStorageName, gameData.highScore);
      var style = {
        font: "32px Arial",
        fill: "#00FF00",
        align: "center"
      };
      var text = game.add.text(game.width/2, (game.height/2) -100, "Game Over \n\n Your Score: "+gameData.score+ "\n\n Your Best Score: "+gameData.highScore+"\n\n Tap to restart", style);
      text.anchor.set(0.5);
      game.input.onDown.add(this.restartGame, this);
    },
    restartGame: function(){
      addDefaultes();
      game.state.start('preStartScreen');
    }
  }
  gameStates.preloadAssets = preloadAssets;
  gameStates.preStartScreen = preStartScreen;
  gameStates.startScreen = startScreen;
  gameStates.playGame = playGame;
  gameStates.gameOver = gameOver;
}
window.onload = function(){
  addDefaultes();
  createGameStates();
  game = new Phaser.Game(550, 600, Phaser.CANVAS,'');
  game.state.add('preloadAssets', gameStates.preloadAssets);
  game.state.add('preStartScreen', gameStates.preStartScreen);
  game.state.add('startScreen', gameStates.startScreen);
  game.state.add('playGame', gameStates.playGame);
  game.state.add('gameOver', gameStates.gameOver);
  gameData.highScore = localStorage.getItem(gameData.localStorageName) == null ? 0 : localStorage.getItem(gameData.localStorageName);
  game.state.start('preloadAssets');
}
