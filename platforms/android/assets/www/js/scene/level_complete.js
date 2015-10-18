// var game = require("./../lib/game");
var util = require("./../lib/util");

var LevelCompleteScene = tine._scene({
    initialize: function() {
        console.log("init level complete scene");

		this.spinner_bg_size = {
			width: 900,
			height: 900
		}

		this.box_bg_size = {
			width: 850,
			height: 980
		}

        //blue background
		var gfx = new createjs.Graphics().
			beginFill("#1F94ED").
			drawRect(0, 0, game.canvas.width, game.canvas.height).
			endFill();	
		this.background = new createjs.Shape(gfx);
		this.background.x = 0;
		this.addChild(this.background);

		//init spinner
		this.spinner = game.create.bitmap("lc_spinner", {
			x: game.canvas.width/2,
			y: game.canvas.height/2,
			regX:'center', 
			regY:'center',
			rotation: 0
		});
		this.addChild(this.spinner);

		//init box background
		this.box_bg = game.create.bitmap("gui_frame_en", {
			x: game.canvas.width/2,
			y: game.canvas.height/2,
			regX:'center', 
			regY:'center'
		});
		this.addChild(this.box_bg);

		//init time text
		this.timeText = game.create.text("12:12", {
			regX:'right', 
			regY:'top',
			font: "40px Arial",
			color: "black"
		});
		this.addChild(this.timeText);

		//init score text
		this.scoreText = game.create.text("0", {
			regX:'right', 
			regY:'top',
			font: "40px Arial",
			color: "black"
		});
		this.addChild(this.scoreText);

		//init global text
		this.globalText = game.create.text("9999", {
			regX:'left', 
			regY:'top',
			font: "40px Arial",
			color: "black"
		});
		this.addChild(this.globalText);

		//init local text
		this.localText = game.create.text("9999", {
			regX:'left', 
			regY:'top',
			font: "40px Arial",
			color: "black"
		});
		this.addChild(this.localText);

        //create facebook share button
		this.facebookButton = game.create.bitmap("facebook_share", {
			regX:'center', 
			regY:'top'
		});

		this.facebookButton.on("click", function(evt){
			console.log("click facebook button");

			var message = {
			    text: "This is a test message"
			};
			window.socialmessage.send(message);
		}, this);

		this.addChild(this.facebookButton);

        //create next button
		var spriteSheet = new createjs.SpriteSheet({
		    images: [
		    	game.load.get("lc_button_next_0"),
		    	game.load.get("lc_button_next_1")
		    ],
		    frames: { width: 125, height: 125},
		    animations: { normal: [0], hover: [1], clicked: [1] }
		});
		this.nextButton = new createjs.Sprite(spriteSheet);
		var nextBtnHelper = new createjs.ButtonHelper(this.nextButton, "normal", "hover", "clicked");

		this.nextButton.on("click", function(evt){
			console.log("click next")
			this.exit();
		}, this);

		this.addChild(this.nextButton);

        //create gift button
		var spriteSheet = new createjs.SpriteSheet({
		    images: [
		    	game.load.get("lc_button_gift_0"),
		    	game.load.get("lc_button_gift_1")
		    ],
		    frames: { width: 125, height: 125},
		    animations: { normal: [0], hover: [1], clicked: [1] }
		});
		this.giftButton = new createjs.Sprite(spriteSheet);
		var giftBtnHelper = new createjs.ButtonHelper(this.giftButton, "normal", "hover", "clicked");

		this.giftButton.on("click", function(evt){
			console.log("click gift")
		}, this);

		this.addChild(this.giftButton);


    	this.resize();
    },
    preEnter: function(){
    	console.log("preEnter level complete scene");
		
		//deactivate keyboard
		document.activeElement.blur();

		var level = game.levelManager.currentLevel;

		//set data
		this.timeText.text = util.parseMMSS(level.statistic.time);
		this.scoreText.text = level.statistic.score;
		this.localText.text = game.player.getRank(level.statistic.id, level.statistic.score);
		this.globalText.text = game.player.getGlobalRank(level.statistic.id, level.statistic.score);

    	game.resize();
    },
    enter: function(){
    	console.log("enter level complete scene");
		
		//deactivate keyboard
		document.activeElement.blur();

    	// game.resize();
    },
    update: function() {
    	this.spinner.rotation+=1;
        // console.log("update level complete scene");
    },
    resize: function(){
        console.log("resize level complete scene");

        var half_width = game.canvas.width/2,
        	half_height = game.canvas.height/2;

        //blue background
        this.background.graphics.clear().beginFill("#1F94ED").drawRect(0, 0, game.canvas.width, game.canvas.height).endFill();

        //spinner
        this.spinner.x = half_width;
        this.spinner.y = half_height;

        var spinnerScale = Math.max(game.canvas.width / this.spinner_bg_size.width, game.canvas.height / this.spinner_bg_size.height);
        this.spinner.scaleX = spinnerScale;
        this.spinner.scaleY = spinnerScale;

        //box
        this.box_bg.x = half_width;
        this.box_bg.y = half_height;

        var scale = Math.min(game.canvas.width / this.box_bg_size.width, game.canvas.height / this.box_bg_size.height);
        this.box_bg.scaleX = scale;
        this.box_bg.scaleY = scale;

        var right_text_position = half_width + 280 * scale;

        this.timeText.x = right_text_position;
        this.timeText.y = half_height - 152 * scale;
        this.timeText.scaleX = scale;
        this.timeText.scaleY = scale;

        this.scoreText.x = right_text_position;
        this.scoreText.y = half_height - 51 * scale;
        this.scoreText.scaleX = scale;
        this.scoreText.scaleY = scale;

        this.globalText.x = half_width + 165 * scale;
        this.globalText.y = half_height + 49 * scale;
        this.globalText.scaleX = scale;
        this.globalText.scaleY = scale;

        this.localText.x = half_width - 35 * scale;
        this.localText.y = half_height + 49 * scale;
        this.localText.scaleX = scale;
        this.localText.scaleY = scale;

        this.facebookButton.x = half_width;
        this.facebookButton.y = half_height + 215 * scale;
        this.facebookButton.scaleX = scale;
        this.facebookButton.scaleY = scale;

        this.nextButton.x = half_width + 145 * scale;
        this.nextButton.y = half_height + 340 * scale;
        this.nextButton.scaleX = scale;
        this.nextButton.scaleY = scale;

        this.giftButton.x = half_width - 275 * scale;
        this.giftButton.y = half_height + 340 * scale;
        this.giftButton.scaleX = scale;
        this.giftButton.scaleY = scale;
    },
    exit: function(){
    	// game.director.replace('play', new tine.transitions.FadeIn(null, 1000));

		if(!game.levelManager.hasNextLevel())
		// if(this.currentLevel >= this.totalLevels)
		{
			game.director.replace('menu');
		}
		else
		{
			var that = this;

			game.levelManager.loadNextLevel(function(){
				game.director.replace('play');
			});
		}
    }
});

module.exports = new LevelCompleteScene();
