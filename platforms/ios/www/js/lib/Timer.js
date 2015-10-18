
var Timer = module.exports = function Timer(opts){

	this.start = undefined;
	this.time = 0;

	this.resume();
}

Timer.prototype.resume = function(){
	console.log("timer resumed");

	this.start = new Date();
};

Timer.prototype.pause = function(){

	if(!this.start) return;

	console.log("timer paused");
	
	var now = new Date();

	this.time += now.getTime() - this.start.getTime();
	this.start = undefined;
};

Timer.prototype.getTime = function(){

	var time = this.time;

	if(this.start)
	{
		var now = new Date();
		time += now.getTime() - this.start.getTime();
	}

	return (time / 1000) | 0;
};

Timer.prototype.getMMSS = function(){

	var s = this.getTime();

    return this.parseMMSS(s);
};

Timer.prototype.parseMMSS = function(s){

    var sec_num = parseInt(s, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
};
