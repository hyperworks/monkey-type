
var TimeLabel = module.exports = function(opts){

	this.game = undefined;
	this.parentContainer = undefined;

	for(var prop in opts){		
		this[prop] = opts[prop];		
	}

	//init text label
	this.label = new createjs.Text("0:00", "20px Arial", "#ff7700");
	this.label.x = 60;
	this.label.y = 20;
	this.label.textBaseline = "alphabetic";
	
	this.parentContainer.addChild(this.label);

	//init clock image
	var image = this.game.getAsset("clock");

	this.clock = new createjs.Bitmap(image);

	this.clock.x = 10;
	this.clock.y = 0;
	this.clock.height = image.height;
	this.clock.width = image.width;

	this.parentContainer.addChild(this.clock);
};

TimeLabel.prototype = {
	update : function(){
		
		this.label.text = this.game.timer.getMMSS();

	},
	resize: function(){

	},
	render : function(){

	}
}