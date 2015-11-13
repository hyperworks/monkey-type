var ToggleButton = module.exports = function ToggleButton(image, w, h, x, y, clickHandler) {
if (!(this instanceof ToggleButton)) {
		return new ToggleButton();
	}
	this.initialize(image, w, h, x, y, clickHandler);
}
	
ToggleButton.prototype = new createjs.Bitmap();
	
ToggleButton.prototype.initialize = function(image, w, h, x, y, clickHandler, state){
	this.image = image;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;

	this.sourceRect = new createjs.Rectangle(0, 0, this.w, this.h);
	this.mouseEnabled = true;

	this.state = false;
	if (state == true) {
		this.switchOn();
	}

	this.addEventListener('click', (function(scope) {
		return function(){
			clickHandler();
			scope.toggle();
		};
	})(this));
};	

ToggleButton.prototype.toggle = function() {
	if (this.state === false) {
		this.switchOn();
	} else if (this.state === true) {
		this.switchOff();
	}
};

ToggleButton.prototype.switchOn = function() {
	this.state = true;
	this.sourceRect = new createjs.Rectangle(this.w, 0, this.w, this.h);
};

ToggleButton.prototype.switchOff = function() {
	this.state = false;
	this.sourceRect = new createjs.Rectangle(0, 0, this.w, this.h);
};