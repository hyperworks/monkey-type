var game = require("./../lib/game");
var $ = require("jquery");
var ndgmr = require("./../lib/vendor/ndgmr.utils");

var ParallaxLayer = require("./../lib/entities/parallax_layer.js");
// var PlatformManager = require("./../lib/entities/platform_manager.js");
var Hero = require("./../lib/entities/hero.js");
var Monster = require("./../lib/entities/monster.js");
var ScoreLabel = require("./../lib/entities/score_label.js");
var TimeLabel = require("./../lib/entities/time_label.js");

var Timer = require("./../lib/timer.js");

var BASE_WIDTH = 320,
	BASE_HEIGHT = 480;

var State = {
	INIT: 0,
	LEVEL_RUNNING: 4,
	MONSTER_DYING: 5,
};

var RUNNABLE_STATES = [
	State.LEVEL_RUNNING,
	State.MONSTER_DYING
]


var PlayScene = tine._scene({
    initialize: function() {
        console.log("init play scene");

    	// this.resize();
    },
    enter: function(){
        console.log("enter play scene");
		var that = this;

		this.state = State.INIT;

		this.canvas = game.canvas;
		// this.stage = this;
		this.assets = game.assets;
		this.gameOver = false;

		this.currentWord = "";
		this.currentIndex = 0;
		this.currentLevel = 0;
		this.totalLevels = 1;
		this.wordDictionary;

		this.points = 0;
		this.correctWords = 0;
		this.lifePoints = 100;
		
		this.seconds = 0;
		this.timer = new Timer();

		this.lasttyped = "";
		this.curTyping = "";

		this.monsterDamage = 100;

		this.removeAllChildren();

		var d = new Date();
		this.lastTick = d.getTime();



		window.localyticsSession.tagEvent("Level started", {});

        this.ignoreInputGuy = false;
		$('.ui').css('display', 'none');
			console.log("Before === textbox has been focused. Get new viewportsize ---", ndgmr.getScreenWidth(), ndgmr.getScreenHeight());
        if(window.cordova){
            if(cordova.plugins && cordova.plugins.Keyboard) {
            	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
        } else {
//		        $( "#inputguy" ).focus().select().show();
        }

        $( "#inputguy" ).focus().select().hide();
        this.ignoreInputGuy = true;
        this.setupKeyBinding();

//		    window.setTimeout(function(){ $( "#inputguy" ).hide();}, 10);

		console.log("after ===2 textbox has been focused. Get new viewportsize ---", ndgmr.getScreenWidth(), ndgmr.getScreenHeight());
		//Resize canvas to fit on the device, and make sure its visible
		this.canvas.width=ndgmr.getScreenWidth();
		this.canvas.height=ndgmr.getScreenHeight();

		// game.resize();

		//bind to mouseup event
		// stage.on("click", function(evt){
		// 	that.handleInput(evt);
		// }, this);

		//initialize parallax layer
		this.parallaxLayer = [];	

		window.debug_play_stage = this;

		this.wpmLabel = new createjs.Text("WPM: 0", "20px Arial", "#ff7700");
		this.wpmLabel.x = 150;
		this.wpmLabel.y = 50;
		this.wpmLabel.textBaseline = "alphabetic";

		this.prefix = new createjs.Text("", "20px Arial", "#ff7700");
		this.prefix.x = 120;
		this.prefix.y = 20;
		this.prefix.textBaseline = "alphabetic";
/*
		this.postfix = new createjs.Text("ABC", "20px Arial", "#ff7700");
		this.postfix.x = this.prefix.x + this.prefix.getMeasuredWidth() + 1;
		this.postfix.y = 20;
		this.postfix.textBaseline = "alphabetic";
*/
		var textContainer = new createjs.Container();
		this.textContainer = textContainer;

		var gameContainer = new createjs.Container();
		this.gameContainer = gameContainer;


		textContainer.y = this.canvas.height - 50;
		textContainer.height = 50;
		gameContainer.y = 0;
		gameContainer.height = this.canvas.height - textContainer.height;

		var gfx = new createjs.Graphics().
			beginLinearGradientFill(["#000","#FFF"], [0.3, 0.7], 0, 20, 0, 120).
			drawRect(0, 0, this.gameContainer.width, this.gameContainer.height).
			endFill();	
						
		var background = new createjs.Shape(gfx);
		background.x = 0;
		this.background = background;

		//loop through the assets, and initialize objects based on it
		for(var i in this.assets){
			var result = this.assets[i];

			// console.log('asset loaded', i);

			switch(i){
				case "stop" :
					//img tags can also be used as bitmap
					var stopBtn = new createjs.Bitmap(result);
					stopBtn.on("click", function(evt){
						this.leave(true);
					}, this);

					stopBtn.x = 50;
					stopBtn.y = 5;
					stopBtn.height = 40;
					stopBtn.width = 40;

					break;
				case "pause" :
					//img tags can also be used as bitmap
					var pauseBtn = new createjs.Bitmap(result);
					pauseBtn.on("click", function(evt){
						this.pause();
					}, this);

					pauseBtn.x = 5;
					pauseBtn.y = 5;
					pauseBtn.height = result.height;
					pauseBtn.width = result.width;
					break;
				case "cloud" :
					this.parallaxLayer['cloud'] = new ParallaxLayer({
						bitmap: result, 
						x: 0, y: 0, 
						width: result.width,
						height: result.height, 
						velocity: {x: -0.0025*500/2, y: 0},
						// acceleration : -0.0025
					});
					break;
				case "ground0":
					this.parallaxLayer['ground0'] = new ParallaxLayer({
						bitmap: result, 
						x: 0, y: this.canvas.height-21, 
						width: this.canvas.width,
						height: 21, 
						velocity: {x: 0, y: 0}, //{x: -0.5, y: 0},
						// acceleration : -0.0000
					});
					break;
				case "ground1":
					this.parallaxLayer['ground1'] = new ParallaxLayer({
						bitmap: result, 
						x: 0, y: that.canvas.height-result.height, 
						width: result.width,
						height: result.height, 
						velocity: {x: -0.0005*500/2, y: 0}, //{x: -0.5, y: 0},
						// acceleration : -0.0005
					});
					break;
				case "ground2":
					this.parallaxLayer['ground2'] = new ParallaxLayer({
						bitmap: result, 
						x: 0, y: that.canvas.height-result.height, 
						width: result.width,
						height: result.height, 
						velocity: {x: -0.005*500/2, y: 0},							
//							velocity: {x: -0.5, y: 0},
						// acceleration : -0.005
					});
					break;
			}
		}			

		//init monster textfield to show current word
		this.showWordLabel = new createjs.Text("", "20px Arial", "#ff7700");
		this.showWordLabel.textBaseline = "alphabetic";		

		//initialize hero
		this.initHero();

		//initialize monster
		this.initMonster();

		textContainer.addChild(
			this.prefix
		);

		gameContainer.addChild(
			this.background,
			this.parallaxLayer['cloud'].graphics,
			this.parallaxLayer['ground1'].graphics,
			this.parallaxLayer['ground2'].graphics,
			this.parallaxLayer['ground0'].graphics,
			this.hero.graphics,
			this.monster.graphics,
			stopBtn,
			pauseBtn,
			this.showWordLabel,
			this.wpmLabel
		);

		//init game objects
		this.scoreLabel = new ScoreLabel({
			game: this, 
			parentContainer: textContainer
		});

		this.timeLabel = new TimeLabel({
			game: this, 
			parentContainer: textContainer
		});

		//add the display elements to the stage
		this.addChild(
			this.gameContainer,				
			this.textContainer
		);
		this.play_paused = false;
		//activate the DOM UI


		//load sound
		createjs.Sound.registerSound({src:"/assets/sound/jump.wav", id:"soundJump"});
		
		//set FPS and start listening to game ticks
		// createjs.Ticker.setFPS(40);

		// this.jsisgarbage = function() { that.resize(that);			};
		// window.addEventListener('resize', this.jsisgarbage, true);

//			createjs.Ticker.on("tick", this.handleTick, this);

		this.loadLevel();
		this.state = State.LEVEL_RUNNING;

    	this.resize();
    },
    update: function() {
		if (this.play_paused) {
			return;
		}

		switch(this.state)
		{
			case State.MONSTER_DYING: 
				if(this.monster.animation.currentAnimation == "death") 
				{
					this.state = State.LEVEL_RUNNING;
					this.incrementWord();
				}
			break;
		}

		//check if current state allows game rendering
		if(RUNNABLE_STATES.indexOf(this.state) == -1) return;


		if(this.hero.alive){
			// if(this.jumpClicked){	
			// 	this.hero.jump();
			// 	this.jumpClicked = false;
			// }
			//update			
			// this.collideWithGroup(this.hero, this.platformManager);

			// this.hero.update();				
		}else{
			//show death state
			// if(!this.gameOver){
			// 	this.leave(true);
			// }		
		}

		this.respawnMonster();

		this.hero.update();							
		this.hero.render();

		this.monster.update();							
		this.monster.render();

		if(!this.monster.dealtDamage && this.monster.isCollided(this.hero))
		{
			//todo use damage sound
			this.playAudio("soundJump");

			this.lifePoints -= this.monsterDamage;
			this.monster.dealtDamage = true;
			console.log('hero received damage', this.monsterDamage, 'current life points:', this.lifePoints)

			if(this.lifePoints <= 0)
			{
				this.hero.alive = false;
				this.hero.animation.gotoAndPlay("death");

				// for(var i in that.parallaxLayer)
				// {
				// 	that.parallaxLayer[i].velocity.x = 0;
				// }
			}
		}


		//update wpm counter
		this.wpmLabel.text = "WPM: " + this.calculateWpm();

		this.scoreLabel.update();
		this.scoreLabel.render(); //for concept, later both should be called through looping a array of game objects

		this.timeLabel.update();
		this.timeLabel.render(); //for concept, later both should be called through looping a array of game objects

//			this.platformManager.update();

//			this.platformManager.render();

		for(var i in this.parallaxLayer){
			this.parallaxLayer[i].update();
			this.parallaxLayer[i].render();
		}			
		// this.update();


		this.highlightWrittentext();
    },
    resize: function(){
        console.log("resize play scene");

        var that = this;
		
		// Resize the canvas element
		var width = this.width = that.canvas.width = ndgmr.getScreenWidth();
		var height = this.height = that.canvas.height = ndgmr.getScreenHeight();

		//calculate scale factors for unit positions and movements
		that.scaleFactorX = width / BASE_WIDTH;
		that.scaleFactorY = (height - that.textContainer.height) / BASE_HEIGHT;


		that.textContainer.y = height - that.textContainer.height;
		
		that.gameContainer.y = 0;
		that.gameContainer.height = height - that.textContainer.height;


		ground0 = that.parallaxLayer['ground0'];
		ground0.graphics.y = that.gameContainer.height-that.parallaxLayer['ground0'].height; //-that.parallaxLayer[i].offset;
		ground0.width = width;

		ground1 = that.parallaxLayer['ground1'];
		ground1.graphics.y = that.gameContainer.height-ground1.height;

		ground2 = that.parallaxLayer['ground2'];
		ground2.graphics.y = that.gameContainer.height-ground2.height-ground0.height;

		//set all parallaxLayer scale factors
		for(var i in that.parallaxLayer)
		{
			that.parallaxLayer[i].setScaleFactors(that.scaleFactorX, that.scaleFactorY);
		}

		//TODO middle of the monster
		that.showWordLabel.x = width - 80;
		    that.showWordLabel.y = ground0.y - ground0.height - 35;

		    that.wpmLabel.x = width - 150;

		that.hero.y = that.gameContainer.height - 21 - that.hero.spriteSheet._frameHeight + 2;
		that.monster.y = that.gameContainer.height - that.monster.spriteSheet._frameHeight + 2;
		console.log(that.monster)
		that.monster.setScaleFactors(that.scaleFactorX, that.scaleFactorY).resize();

		that.scoreLabel.resize();
		that.timeLabel.resize();

		that.background.graphics.clear()
		that.background.graphics.beginLinearGradientFill(["#05192F","#1B6794"], [0.3, 0.7], 0, 100, 0, this.canvas.height).
			drawRect(0, 0, width, that.gameContainer.height).
			endFill();	


		window.scrollTo(0,0);
    },
    exit: function(){
    	
    },


	getAsset: function(name){
		return this.assets[name];
	},
	calculateWpm: function(){

		var time = this.timer.getTime();

		if(!time || time <= 0) return 0;

		return (this.correctWords/(time/60)) | 0;
	},
	// loadLevelConfig: function(){
	// 	var that = this;

	// 	$.getJSON("js/levels/config.json", function(data) {
	// 	    that.totalLevels = data.levels;

	// 	    that.loadLevel();
	// 	}).done(function(data) {
	// 	    console.log("level config loaded", data);
	// 	}).fail(function(e) {
	// 	    console.log("error loading level config", e);
	// 	});
	// },
	setupNewWord: function() {
	 	this.currentWord = this.wordDictionary[this.currentIndex]
//		 	this.theWordDom.innerHTML = this.currentWord;
		this.prefix.text = "";
//			this.postfix.innerText = this.currentWord;
		this.showWordLabel.text = this.currentWord;
		this.curTyping = "";
	},
	incrementWord: function() {
		console.log("incrementWord", this.currentIndex, this.wordDictionary);

		this.currentIndex++;

		this.resetMonster();

		this.hero.animation.gotoAndPlay('run');

		if(this.currentIndex == this.wordDictionary.length)
		{
			this.levelComplete();

			// clearInterval(this.timerUpdate);
			// //http://www.speedtypingonline.com/typing-equations
			// alert("Level Complete!")
			// //this.wpm = 27; //calculate
			// //alert("Level Complete, you have " + this.wpm + " WPM");
			
			// return;
		}	
		else
		{
			this.timer.resume();
			this.setupNewWord();
		}
	},
	respawnMonster: function(){
		if(this.monster.x < 0)
		{
			this.incrementWord();
		}
	},
	resetMonster: function(){
		this.monster.animation.gotoAndPlay("run");
		this.monster.x = 315;
		this.monster.dealtDamage = false;
	},
	loadLevel: function() {

		this.wordDictionary = game.levelManager.currentLevel.data;

		console.log('loadLevel', this.wordDictionary);

		this.setupNewWord();

        if(!window.cordova){
		this.intervalInputGuy =	setInterval(function() {
				if($( "#inputguy" ).val() == "") {
					$( "#inputguy" ).focus().select();
				};
			}, 10);
		}

		this.timer.resume();
	},
	levelComplete: function(){
		this.currentLevel++;

		this.timer.pause();

		// alert("level complete!\nscore: "+this.points+"\nwords: "+this.correctWords+"/"+(this.wordDictionary.length)+"\nwpm: "+this.calculateWpm()+"\nlife: "+(this.lifePoints));

		game.levelManager.levelComplete(
			this.points, 
			this.lifePoints,
			this.timer.getTime(),
			this.calculateWpm(),
			this.correctWords,
			this.wordDictionary.length
		);

		//prepare scene for exist
	 	clearInterval(this.intervalInputGuy);

		window.localyticsSession.tagEvent("Level finished", {});

		//Weird ios bug, need to reshow the keyboard before the blur
        $( "#inputguy" ).focus().select().show();

	 	clearInterval(this.intervalInputGuy);

	 	//show level compelte scene
        game.director.replace('level_complete', new tine.transitions.FadeIn(null, 1000));	

		// if(!game.levelManager.hasNextLevel())
		// // if(this.currentLevel >= this.totalLevels)
		// {
		// 	this.gameComplete();
		// }
		// else
		// {
		// 	// console.log("start next level", this.currentLevel+1);
			
		// 	// // this.seconds = 0;
		// 	// // clearInterval(this.timerUpdate);
			
		// 	// // createjs.Ticker.off("tick", this.handleTickRet);
		// 	// this.currentIndex = 0;
		// 	// this.correctWords = 0;
		// 	// this.timer = new Timer();
		// 	// this.timer.pause()

		// 	var that = this;

		// 	game.levelManager.loadNextLevel(function(){
		// 		that.loadLevel();
		// 	});
			
		// }
	},
	gameComplete: function(){
		console.log("game finished", this.currentLevel+1, "time", this.timer.getTime());
		// clearInterval(this.timerUpdate);
		this.leave(false);
	},
	leave: function(left) {
		if (left == true) {
			window.localyticsSession.tagEvent("Level exited", {});
		} else {
			window.localyticsSession.tagEvent("Level finished", {});
		}
		//Weird ios bug, need to reshow the keyboard before the blur
        $( "#inputguy" ).focus().select().show();
		this.gameOver = true;
		// createjs.Ticker.off("tick", this.handleTickRet);
	 	// window.removeEventListener('resize', this.resize);
	 	clearInterval(this.intervalInputGuy);
		this.removeAllChildren();
//		$(this.theWordDom).hide();
//		$("#inputguy").val("");
		this.parallaxLayer = [];			


        game.director.replace('menu', new tine.transitions.FadeIn(null, 1000));	
	},
	initHero: function(){
		var spriteSheetData = {
			animations : {
				run: {
					frames : [0, 1, 2, 3, 4, 5],
					speed: 0.2
				},
				jump: {
					frames : [6, 7, 8, 9],
					speed: 0.2
				},
				death: 10
			},
			frames : {
				width: 100, height: 100
			},
			images : ['assets/sprite/monkey_animate_100.png']
		};

		var ss = new createjs.SpriteSheet(spriteSheetData);
		
		this.hero = new Hero({
			spriteSheet : ss,
			x : 25,
			y: 540,
			positionYSubtractSize: true,
			velocity : {x: 0, y:0},
			name: "hero"
		});
	},
	initMonster: function(){
		var spriteSheetData2 = {
			animations : {
				run: {
					frames : [/*0, */1, 2, 3, 4, 5, 6, 7, 8],
					speed: 0.2
				},
				die: {
					frames : [9, 10, 11, 12, 13],
					speed: 0.1,
					next: "death"
				},
				death: 13
			},
			frames : {
				width : 100, height: 100
			},
			images : ['assets/sprite/monster_animate-NEW2.png']
		};	

		var ss2 = new createjs.SpriteSheet(spriteSheetData2);

		this.monster = new Monster({
			spriteSheet : ss2,
			// x: 200,
			y: 540,
			x: 315,
			// y: 438,
			scalePositionX: true,
			positionXSubtractSize: true,
			velocity : {
				x: -0.8, 
				y: 0
			},
			name: "monster",
			textBox: this.showWordLabel
		});
	},
	exit : function(){
		console.log('EXIT TO GAMEOVER SCREEN');
	},
	handleInput : function(){
		this.jumpClicked = true;
	},
	collideWithGroup : function(objA, objB){			
		var groupB = objB.collidables;
		for(var i in groupB){				
			this.collides(objA, groupB[i], objA.collide, objB.collide);
		}
	},		
	collides : function(objA, objB, objACallback, objBCallback){			
		var rect1 = objA.boundingBox;
		var rect2 = objB.boundingBox;
		
		// calculate if there is an overlap between the bounds
		var r1={}, r2={};
		r1.left = rect1.x + objA.getFuturePosition().x;
		r1.top = rect1.y + objA.getFuturePosition().y;
		r1.right = r1.left + rect1.width;
		r1.bottom = r1.top + rect1.height;

		r2.left = rect2.x + objB.getFuturePosition().x;
		r2.top = rect2.y + objB.getFuturePosition().y;
		r2.right = r2.left + rect2.width;
		r2.bottom = r2.top + rect2.height;

		var x_overlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
		var y_overlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));			
		if (x_overlap > 0 && y_overlap > 0) {	
			objACallback.call(objA, objB, {width: x_overlap, height: y_overlap})						   
		} else {
		  	return null;
		}			
	},
	highlightWrittentext: function() {
		var data = "";
		if( this.ignoreInputGuy == true ){
			data = this.curTyping;
		} else {
			data = $( "#inputguy" ).val()
		}

		if(data == this.lasttyped) {
			//nothing has changed
			return;
		}
		this.lasttyped = data;
/*
		var i = 0;
		for(i=0;i<this.currentWord.length;i++) {
			if (this.currentWord[i] != data[i]) {
				break;
			}
		}
*/

		//prefix=this.currentWord.slice(0,i)
		//postfix=this.currentWord.slice(i)

//			console.log("switching text", that.prefix.text);
		this.prefix.text = data;

//			that = this;
//			this.theWordDom.innerHTML = "<b style=\"color:red;\"><span class=\"prefix\">" +prefix+"</b>" + postfix;
/*
		requestAnimationFrame(function() {
			that.prefix.innerText = prefix;
			that.postfix.innerText = postfix;
		});
*/


		if (data == this.currentWord) {
			console.log("Finished word " + this.currentWord)
			$( "#inputguy" ).val("")
			this.points = this.points + 10 //TODO remove points for mistakes

			this.monsterKilled();
		}
	},
	monsterKilled: function(){

		if(this.state == State.MONSTER_DYING) return;
		
		this.state = State.MONSTER_DYING;
		this.timer.pause();
		this.correctWords++;

		this.monster.animation.gotoAndPlay("die");

		this.playAudio("soundJump");

		this.currentWord = "";
		this.showWordLabel.text = this.currentWord;
		this.curTyping = "";
	},
	playAudio: function(id) {

		//use cordova media plugin if available
		if(window.cordova)
		{
		    var url = document.getElementById(id).getAttribute('src');
		    var sound = new Media(url);

		    sound.play();
		}
		//else us createjs sound lib
		else
		{
			createjs.Sound.play("soundJump");
		}

	},
	pause: function() {
		this.play_paused = !this.play_paused;
		console.log("pause-",this.play_paused)

		//pause game
		if(this.play_paused)
		{
			this.timer.pause();
			
			this.hero.animation.gotoAndStop('run');
			this.monster.animation.gotoAndStop('run');
		}
		//resume game
		else
		{
			this.timer.resume();

			this.hero.animation.gotoAndPlay('run');
			this.monster.animation.gotoAndPlay('run');
		}
	}, 
	setupKeyBinding: function () {

		if(!this.eventHandlers)
		{
			this.eventHandlers = true;

			var that = this;

			document.addEventListener("keypress", function onKeyPress(e){

		        var val = this.value;

		        charcode = e.keycode || e.which
		        mychar = String.fromCharCode(charcode)

		        // console.log(" e.keycode ",  e.keycode );
		        // console.log(" e.which ",  e.which );
		        // console.log(" mychar ",  mychar );
		        that.curTyping = that.curTyping + mychar;
		    });

			document.addEventListener("keydown", function onKeyDown(e){
				console.log("keydown", e.which);

		        if (e.which  == 8) {
		        	console.log("Backspace !!!!")

		        	that.curTyping = that.curTyping.slice(0,-1);
		        	return;
		        }
		    });
		}
	}
});

module.exports = new PlayScene();



// function getParameterByName(name) {
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }


