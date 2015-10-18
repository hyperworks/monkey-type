// var game = require("./game");

var Level = module.exports = function Level(data)
{
	this.data = data;
}

Level.prototype.complete = function complete(id, score, lifePoints, time, wpm, wordsSolved, totalWords)
{
	this.statistic = {
		id: id,
		score: score,
		lifePoints: lifePoints,
		time: time,
		wpm: wpm,
		wordsSolved: wordsSolved,
		totalWords: totalWords
	};

	game.player.levelComplete(id, score, lifePoints, time, wpm, wordsSolved, totalWords);
}
