
var ScoreLabel = module.exports = function(opts){

	this.game = undefined;
	this.parentContainer = undefined;

	for(var prop in opts){		
		this[prop] = opts[prop];		
	}

	//init text label
	this.label = new createjs.Text("0", "20px Arial", "#ff7700");
	this.label.x = 350;
	this.label.y = 20;
	this.label.textBaseline = "alphabetic";
	
	this.parentContainer.addChild(this.label);

	//init coin image
	var image = this.game.getAsset("coin");

	this.coin = new createjs.Bitmap(image);
	this.coin.x = 0;
	this.coin.y = 0;
	this.coin.height = image.height;
	this.coin.width = image.width;

	this.parentContainer.addChild(this.coin);
};

ScoreLabel.prototype = {
	update : function(){
		
		this.label.text = this.game.points;

	},
	resize: function(){

		this.coin.x = this.game.width - 80;
		this.label.x = this.coin.x + this.coin.width + 2;

	},
	render : function(){

	}
}	
