var _ = require("lodash");
var ndgmr = require("./vendor/ndgmr.utils");
var config = require("config");
var LevelManager = require("./level_manager");

var game = window.game = module.exports = new tine.Game(require("../game_config"), {
	boot: function(){
		console.log("running game boot");

        //handle scaling
        window.addEventListener('resize', game.resize);
        game.resize();

		//show preload scene
        game.director.add('preload', require("./../scene/Preload.js"));
        game.director.replace('preload');

        //activate touch support
		createjs.Touch.enable(this.stage);

		//initiate variables
		game.assets = [];

		//initiate external tracking
		var localyticsSession = LocalyticsSession("2702407aba18298eb9bacdb-ba8efede-02ba-11e5-4821-00712085a1eb");
		localyticsSession.open();
		localyticsSession.upload();

		window.localyticsSession = localyticsSession;
	},
	preload: function(){
		console.log("running game preload");

		game.load.image("cloud", config.path.assets + "img/5-june-cloud-1.png"); 
		game.load.image("ground0", config.path.assets + "img/bg-town-Lv0.png");
		game.load.image("ground1", config.path.assets + "img/5-june-bg-town-Lv1.png");
		game.load.image("ground2", config.path.assets + "img/5-june-bg-town-Lv2.png");

		game.load.image("stop", config.path.assets + "img/gui_menu_back.png");  
		game.load.image("pause", config.path.assets + "img/gui_menu_pause.png"); 
		game.load.image("clock", config.path.assets + "img/gui_menu_clock.png"); 
		game.load.image("coin", config.path.assets + "img/gui-game-coin.png"); 
		game.load.image("button_play_0", config.path.assets + "img/gui_button_play_icon-0.png"); 
		game.load.image("button_play_1", config.path.assets + "img/gui_button_play_icon-1.png"); 
		game.load.image("logo_2x", config.path.assets + "img/5-6-2015-logo-th-2x.png"); 
		
		game.load.image("gui_frame_en", config.path.assets + "img/level_complete/gui_high-score_en.png"); 
		game.load.image("gui_frame_th", config.path.assets + "img/level_complete/gui_high-score_th.png"); 
		game.load.image("facebook_share", config.path.assets + "img/level_complete/gui_button_share_1-2.png"); 
		game.load.image("highscore_sticker", config.path.assets + "img/level_complete/gui_sticker_highscore-2.png"); 
		game.load.image("lc_spinner", config.path.assets + "img/level_complete/gui_highlight_bg_1.png"); 
		game.load.image("lc_button_next_1", config.path.assets + "img/level_complete/gui_game_button_next_1.png"); 
		game.load.image("lc_button_next_0", config.path.assets + "img/level_complete/gui_game_button_next_0.png"); 
		game.load.image("lc_button_gift_1", config.path.assets + "img/level_complete/gui_game_button_gif_1.png"); 
		game.load.image("lc_button_gift_0", config.path.assets + "img/level_complete/gui_game_button_gif_0.png"); 

		game.load.spritesheet("monkey", config.path.assets + "sprite/monkey_animate_100.png", {
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
			}
		});

		game.load.spritesheet("monster", config.path.assets + "sprite/monster_animate-NEW2.png", {
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
			frames: {
				width: 100, 
				height: 100
			}
		});
		
		game.load.audio("jump_sound", config.path.assets + "sound/jump.wav");
		game.load.audio("gameplay_sound", config.path.assets + "sound/gameplay.wav");
	},
	create: function(){
		console.log("running game create");

		//init player
		var Player = require("./Player");
		game.player = new Player();

        // Add your scenes to the director
        game.director.add('menu', require("./../scene/Menu"));
        game.director.add('play', require("./../scene/Play"));
        game.director.add('level_complete', require("./../scene/level_complete"));

        //init level manager
		game.levelManager = new LevelManager();

        // Run a scene
        game.director.replace('menu', new tine.transitions.FadeIn(null, 1000));
        // game.director.replace('play', new tine.transitions.FadeIn(null, 1000));
        // game.director.replace('level_complete', new tine.transitions.FadeIn(null, 1000));
	},
	update: function(){
		if(game.director.getCurrentScene()) game.director.getCurrentScene().update();
	},
	draw: function(){
		// console.log("running game draw");
	}
});

game.resize = function(){
	console.log("resize!");
	game.canvas.width = ndgmr.getScreenWidth();
	game.canvas.height = ndgmr.getScreenHeight();

	game.scaleFactorX = game.canvas.width / config.base_width;
	game.scaleFactorY = (game.canvas.height - /*that.textContainer.height*/50) / config.base_height;

	if(game.director.getCurrentScene()) game.director.getCurrentScene().resize();
}



