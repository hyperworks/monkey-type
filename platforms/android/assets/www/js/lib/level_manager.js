var game = require("./game");
var Level = require("./Level");
var $ = require("jquery");

var LevelManager = module.exports = function LevelManager()
{
	this.currentLevel;
	this.config = {};

	this.currentLevelIndex = -1;
	this.loadedLevelData = [];

	this.loadLevelConfig();
}

LevelManager.prototype.loadLevelConfig = function loadLevelConfig()
{
	var that = this;

	$.getJSON("/js/levels/config.json", function(data) {
	    that.config.levels = data.levels;

	    that.loadNextLevel();
	}).done(function(data) {
	    console.log("level config loaded", data);
	}).fail(function(e) {
	    console.log("error loading level config", e);
	});
}

LevelManager.prototype.hasNextLevel = function hasNextLevel()
{
	var nextLevel = this.currentLevelIndex + 1;

	return nextLevel < that.config.levels;
}

LevelManager.prototype.loadLevel = function loadLevel(id)
{
	if(!id) id = 0;

	this.currentLevelIndex = id - 1;

	this.loadNextLevel();
}

LevelManager.prototype.loadNextLevel = function loadNextLevel(cb)
{
	that = this;

	this.currentLevelIndex++;

	//init language
	game.language = "th-TH";

	if(getParameterByName("debug").indexOf("true") != -1)
	{
	    game.language = "en-EN";
	}



	var levelConfigFile = "/js/levels/" + this.currentLevelIndex + "/wordlist_" + game.language + ".json";

	console.log('load word list', levelConfigFile);

	$.getJSON(levelConfigFile, function(levelData) {

	    console.log('words loaded', levelData);

	    that.currentLevel = new Level(levelData);

	    // that.wordDictionary = levelData;
	    // that.setupNewWord();

	    // if (!window.cordova) {
	    //     that.intervalInputGuy = setInterval(function() {
	    //         if ($("#inputguy").val() == "") {
	    //             $("#inputguy").focus().select();
	    //         };
	    //     }, 10);
	    // }

	    // that.timerUpdate = setInterval(that.updateTime, 1000, that);
	    // that.timer.resume();
	    // that.handleTickRet = createjs.Ticker.on("tick", that.handleTick, that);

	    if(cb) cb();

	}).done(function() {
	    console.log("second success");
	}).fail(function(e) {
	    console.log("error", e);
	    alert("Failed loading word data");
	})

}

LevelManager.prototype.levelComplete = function levelComplete(score, lifePoints, time, wpm, wordsSolved, totalWords)
{
	this.currentLevel.complete(this.currentLevelIndex, score, lifePoints, time, wpm, wordsSolved, totalWords);
}



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
