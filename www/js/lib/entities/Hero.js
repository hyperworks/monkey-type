var Hero = module.exports = function(opts){
	// INITIALIZE PROPERTIES		
	// this.width = 30;
	// this.height = 30;
	this.x = 0;
	this.y = 0;		
	this.spriteSheet = null;
	this.acceleration = .4;	
	this.velocity = {x: 0, y: 0};
	this.positionYSubtractSize = false;
	this.positionXSubtractSize = false;
	this.scalePositionX = false;
	this.scalePositionY = false;
	this.scaleFactorX = 1;
	this.scaleFactorY = 1;
	this.name = "unit";

	for(var prop in opts){		
		this[prop] = opts[prop];		
	}

	this.width = this.spriteSheet._frameWidth;
	this.height = this.spriteSheet._frameHeight;

	this.alive = true;
	this.onGround = false;

	// setup bounding box with an offset of x: 20, y: 20
	this.boundingBox = new createjs.Rectangle(20, 20, this.width, this.height);
/*
	// Bounding box graphics					
	var boundingBoxGfx = new createjs.Graphics();
	boundingBoxGfx.beginStroke('#00000')
		.drawRect(this.boundingBox.x, 
				this.boundingBox.y, 
				this.boundingBox.width, 
				this.boundingBox.height);
	var debugBox = new createjs.Shape(boundingBoxGfx);
*/		
	
	// setup animation
	this.animation = new createjs.Sprite(this.spriteSheet);
	this.animation.gotoAndPlay('run');

	//save init position
	this.scaled = {
		x: this.x,
		y: this.y,
		velocity: {
			x: this.velocity.x,
			y: this.velocity.y
		}
	}
	
	// Create our graphics container
	this.graphics = new createjs.Container();		
	this.graphics.addChild(this.animation);//, debugBox);

	// this.render();
};

Hero.prototype = {
	update : function(){
/*
		if(this.collision){	
			if(this.animation.currentAnimation != 'run')
				this.animation.gotoAndPlay('run');
			this.onGround = true;				
			this.collision = null;
		}else{							
			this.velocity.y += this.acceleration;			
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if(this.y > 800){
			this.y = -50;
		}			
*/
		if(this.animation.currentAnimation == 'run')
		{
			this.move();
		}
	},
	move: function(){
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if(this.velocity.x != 0 || this.velocity.y != 0)
		{
			this.resize();
		}
	},
	setScaleFactors: function(scaleFactorX, scaleFactorY){
		this.scaleFactorX = scaleFactorX;
		this.scaleFactorY = scaleFactorY;

		return this;
	},
	resize: function(){

		if(this.scalePositionX)
		{
			this.scaled.x = this.x * this.scaleFactorX;

			//adjust position minus current size
			if(this.positionXSubtractSize)
			{
				this.scaled.x -= this.width;
			}

			//scale velocity
			this.scaled.velocity.x = this.velocity.x * this.scaleFactorX;
		}

		if(this.scalePositionY)
		{
			this.scaled.y = this.y * this.scaleFactorY;

			//adjust position minus current size
			if(this.positionYSubtractSize)
			{
				this.scaled.y -= this.height;
			}

			//scale velocity
			this.scaled.velocity.y = this.velocity.y * this.scaleFactorY;
		}
	},
	render : function(){
		this.graphics.x = this.scalePositionX ? this.scaled.x : this.x;
		this.graphics.y = this.scalePositionY ? this.scaled.y : this.y;
	},
	getFuturePosition : function(){
		return {
			x : this.x + this.velocity.x,
			y : this.y + this.velocity.y
		}
	},
	jump : function(){	
/*
		this.animation.gotoAndPlay('jump');
		this.onGround = false;
		this.velocity.y = -10;
*/
	},
	isCollided: function(object){
		var object1 = {
			x: this.graphics.x,
			y: this.graphics.y,
			width: this.width,
			height: this.height,
		};	

		var object2 = {
			x: object.graphics.x,
			y: object.graphics.y,
			width: object.width,
			height: object.height,
		};	

		//add offset for hero unit
		if(this.name == "hero")
		{
			object1.x += 15;
			object1.width -=15;
		}

		if(object.name == "hero")
		{
			object2.x += 15;
			object2.width -=15;
		}

		if (object1.x < object2.x + object2.width &&
	        object1.x + object1.width > object2.x &&
	        object1.y < object2.y + object2.height &&
	        object1.height + object1.y > object2.y)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	collide : function(objB, data){
	    //check if the hero collided from the top/bottom 
	    //or from the sides
		if(data.width < data.height){
			this._separateX(objB, data);	
		}else{
			this._separateY(objB, data);		
			this.collision = data;
		}
	},
	_separateX : function(objB, data){
		var overlap = data.width;
		var objBX = objB.getFuturePosition().x;		

		if(objBX > this.x){
			//Collided on 'right';			
			this.x -= overlap;        
	                //'absorb' the velocity of the collided object
			this.velocity.x = objB.velocity.x;
		}else{
			//Collided on 'left';
			this.x += overlap;
		}
	},
	_separateY : function(objB, data){
/*
		var overlap = data.height;	

		if(overlap > 1 ){
			//Collided on bottom
			this.y = (objB.y + objB.boundingBox.y) - this.boundingBox.height - this.boundingBox.y;
			this.velocity.y = 0;			
		}
*/
	}
}	
