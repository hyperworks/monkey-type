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
		    	game.load.get("lc_button_next_0"),
		    	game.load.get("lc_button_next_1")
		    ],
		    frames: { width: 125, height: 125},
		    animations: { normal: [0], hover: [1], clicked: [1] }
		});

		var buttonSave = new createjs.Sprite(spriteSheet);
		var startBtn = new createjs.ButtonHelper(buttonSave, "normal", "hover", "clicked");
 		this.toggleMusicBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 40, 40, 100, 100, this.toggleMusic, util.getStorageSettingDefaulted("enableMusic", true)) 
 		this.toggleSoundBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 40, 40, 100, 150, this.toggleMusic, util.getStorageSettingDefaulted("enableSound", true)) 
 		this.toggleThaiBtn = new ToggleButton(game.load.get("setting_btn_play_0"), 40, 40, 100, 200, this.toggleLanguage, util.getStorageSettingDefaulted("enableThai", true)) 

		this.musicLabel = new createjs.Text("Enable Background Music", "20px Arial", "#ff7700");
		this.musicLabel.x = 160;
		this.musicLabel.y = 100;
		this.musicLabel.textBaseline = "alphabetic";

		this.soundLabel = new createjs.Text("Enable Sounds", "20px Arial", "#ff7700");
		this.soundLabel.x = 160;
		this.soundLabel.y = 150;
		this.soundLabel.textBaseline = "alphabetic";


		this.enableThaiLabel = new createjs.Text("Typing Language Thai", "20px Arial", "#ff7700");
		this.enableThaiLabel.x = 160;
		this.enableThaiLabel.y = 200;
		this.enableThaiLabel.textBaseline = "alphabetic";


		buttonSave.on("click", function(evt){
			this.exit();
		}, this);


		buttonSave.height = 200;
		buttonSave.width = 200;
		buttonSave.gotoAndStop("normal");

		this.buttonSave = buttonSave;
		this.addChild(buttonSave);
		this.addChild(this.toggleMusicBtn);
		this.addChild(this.toggleSoundBtn);
		this.addChild(this.toggleThaiBtn);
		this.addChild(this.musicLabel);
		this.addChild(this.soundLabel);
		this.addChild(this.enableThaiLabel);


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
    	localStorage.setItem("enableMusic", this.toggleMusicBtn.state)
    	localStorage.setItem("enableSound", this.toggleSoundBtn.state)
    	localStorage.setItem("enableThai", this.toggleThaiBtn.state)

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
