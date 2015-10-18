var game = require("./game");

var Player = module.exports = function Player(){

	this.data = game.storage.get('player');

	if(!this.data)
	{
		this.data = {
			completedLevels: []
		}
	}

	console.log('player storage', this.data);
}

Player.prototype.save = function save()
{
	game.storage.set('player', this.data);
}

Player.prototype.levelComplete = function levelComplete(id, score, lifePoints, time, wpm, wordsSolved, totalWords)
{
	this.data.completedLevels.push({
		id: id,
		date: new Date(),
		score: score,
		lifePoints: lifePoints,
		wpm: wpm,
		time: time,
		wordsSolved: wordsSolved,
		wordsMissed: totalWords - wordsSolved,
	});

	this.save();
}

Player.prototype.getRank = function getRank(level, score)
{
	var rank = 1;

	for (var i = 0; i < this.data.completedLevels.length; i++)
	{
		var level = this.data.completedLevels[i];

		if(level.id = level && level.score >= score)
		{
			rank++;
		}
	};

	return rank;
}

Player.prototype.getGlobalRank = function getGlobalRank(level, score)
{
	var rank = 1;

	for (var i = 0; i < this.data.completedLevels.length; i++)
	{
		var level = this.data.completedLevels[i];

		if(level.score >= score)
		{
			rank++;
		}
	};

	return rank;
}