var game = require("./../lib/game");

var ToggleButton = require("./../lib/togglebutton.js");
var util = require("./../lib/util");

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

		var buttonSave = new createjs.Sprite(spriteSheet);
		var buttonSetting = new createjs.Sprite(spriteSheetSetting);
		var startBtn = new createjs.ButtonHelper(buttonSave, "normal", "hover", "clicked");
		var settingBtn = new createjs.ButtonHelper(buttonSetting, "normal", "hover", "clicked");
 		var toggleMusicBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 40, 40, 100, 100, this.toggleMusic, util.getStorageSettingDefaulted("enableMusic", true)) 
 		var toggleSoundBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 60, 40, 100, 100, this.toggleMusic, util.getStorageSettingDefaulted("enableSound", true)) 
 		var toggleLanguageBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 80, 40, 100, 100, this.toggleLanguage, util.getStorageSettingDefaulted("enableThai", true)) 

		buttonSetting.on("click", function(evt){
			this.settingsScreen();
		}, this);


		buttonSave.height = 200;
		buttonSave.width = 200;
		buttonSave.gotoAndStop("normal");

		buttonSetting.height = 150;
		buttonSetting.width = 150;
		buttonSetting.gotoAndStop("normal");

		this.buttonSave = buttonSave;
		this.addChild(buttonSave);
		this.addChild(toggleMusicBtn);
		this.addChild(toggleSoundBtn);
		this.addChild(toggleLanguageBtn);


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


		this.buttonSave.y = game.canvas.height - 250;

		//center the button under the logo
		this.buttonSave.x = (game.canvas.width / 2) - (this.buttonSave.width / 2);

		// Background: full screen redraw 
		this.background.graphics.clear()

		this.background.graphics.beginLinearGradientFill(["#05192F","#1B6794"], [0.3, 0.7], 0, 100, 0, game.canvas.height).
			drawRect(0, 0, game.canvas.width, game.canvas.height).
			endFill();	
    },
    exit: function(){
        game.director.replace('menu', new tine.transitions.FadeIn(null, 1000));	
    },
    toggleMusic: function() {
    },
    toggleSounds: function() {
    },
    //What language they are learning
    toggleLanguage: function() {
    },
    //What menus should be written in
    toggleToggleHomeLanguage: function() {
    },
    toggleAllowWrongKeys: function() {
    },
});

module.exports = new SettingScene();
