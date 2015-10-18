var Hero = require("./hero.js");

var Monster = module.exports = function(opts){

	this.textBox = undefined;
	this.textBoxOffsetX = -3;
	this.dealtDamage = false;
	
	//call hero constructor
	Hero.apply(this, arguments);
};

//extend hero class
Monster.prototype = Object.create(Hero.prototype);

Monster.prototype.update = function update()
{
	Hero.prototype.update.call(this);

	var textWidth = this.textBox.getMeasuredWidth();

	this.textBox.x = this.scaled.x + (this.width / 2 - textWidth / 2) + this.textBoxOffsetX;
}
