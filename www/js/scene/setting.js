var game = require("./../lib/game");

var SettingScene = tine._scene({
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
		var spriteSheetSetting = new createjs.SpriteSheet({
		    images: [
		    	game.load.get("setting_btn_play_0"),
		    	game.load.get("setting_btn_play_1")
		    ],
		    frames: { width: 125, height: 125},
		    animations: { normal: [0], hover: [1], clicked: [1] }
		});

		var button = new createjs.Sprite(spriteSheet);
		var buttonSetting = new createjs.Sprite(spriteSheetSetting);
		var startBtn = new createjs.ButtonHelper(button, "normal", "hover", "clicked");
		var settingBtn = new createjs.ButtonHelper(buttonSetting, "normal", "hover", "clicked");

		buttonSetting.on("click", function(evt){
			this.settingsScreen();
		}, this);


		button.height = 200;
		button.width = 200;
		button.gotoAndStop("normal");

		buttonSetting.height = 150;
		buttonSetting.width = 150;
		buttonSetting.gotoAndStop("normal");

		this.button = button;
		this.buttonSetting = buttonSetting;
		this.addChild(button);
		this.addChild(buttonSetting);



    	this.resize();
    },
	enter: function(){
    	console.log("enter setting scene");
    	
		//deactivate keyboard
		document.activeElement.blur();

    	game.resize();
    	this.resize();
    },
    resize: function(){
        console.log("resize menu scene");


		this.buttonSetting.y = game.canvas.height - 350;
		this.buttonSetting.x = (game.canvas.width / 2) - (this.buttonSetting.width / 2);

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
        game.director.replace('menu', new tine.transitions.FadeIn(null, 1000));	
    },
});

module.exports = new SettingScene();
