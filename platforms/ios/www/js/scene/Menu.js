var game = require("./../lib/game");

var MenuScene = tine._scene({
    initialize: function() {
        console.log("init menu scene");

		//create background
		var gfx = new createjs.Graphics().
			beginLinearGradientFill(["#000","#FFF"], [0.3, 0.7], 0, 20, 0, 120).
			drawRect(0, 0, game.canvas.width, game.canvas.height).
			endFill();	
						


		var background = new createjs.Shape(gfx);
		background.x = 0;
		this.background = background;

		this.addChild(background);

        //create button
		var spriteSheet = new createjs.SpriteSheet({
		    images: [
		    	game.load.get("button_play_0"),
		    	game.load.get("button_play_1")
		    ],
		    frames: { width: 200, height: 200},
		    animations: { normal: [0], hover: [1], clicked: [1] }
		});
		var button = new createjs.Sprite(spriteSheet);
		var startBtn = new createjs.ButtonHelper(button, "normal", "hover", "clicked");

		button.on("click", function(evt){
			this.exit();
		}, this);

		button.height = 200;
		button.width = 200;
		button.gotoAndStop("normal");

		this.button = button;
		this.addChild(button);

		//create logo
		logo = new createjs.Bitmap(game.load.get("logo_2x"));
		logo.y = 30;
		logo.scaleY = 0.38;
		logo.scaleX = 0.38;
		this.logo = logo;

		this.addChild(logo);

    	this.resize();
    },
  //   preEnter: function(){
  //   	console.log("preEnter menu scene");
    	
		// //deactivate keyboard
		// document.activeElement.blur();

  //   	game.resize();
  //   	this.resize();
  //   },
    enter: function(){
    	console.log("enter menu scene");
    	
		//deactivate keyboard
		document.activeElement.blur();

    	game.resize();
    	this.resize();
    },
    update: function() {
        // console.log("update menu scene");
    },
    resize: function(){
        console.log("resize menu scene");

		this.logo.x = (game.canvas.width / 2) - (330 / 2);

		this.button.y = game.canvas.height - 250;

		//center the button under the logo
		this.button.x = (game.canvas.width / 2) - (this.button.width / 2);

		// Background: full screen redraw 
		this.background.graphics.clear()

		this.background.graphics.beginLinearGradientFill(["#05192F","#1B6794"], [0.3, 0.7], 0, 100, 0, game.canvas.height).
			drawRect(0, 0, game.canvas.width, game.canvas.height).
			endFill();	
    },
    exit: function(){
    	// game.director.replace('play', new tine.transitions.FadeIn(null, 1000));

    	game.levelManager.loadLevel();
    	game.director.replace('play');
    }
});

module.exports = new MenuScene();
