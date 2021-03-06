var k_factor = 32;
var streak_factor = 5;

exports.setKFactor = function(k) {
	k_factor = k;
}

exports.setStreakFactor = function(s) {
	streak_factor = s;
}

exports.getKFactor = function() {
	return k_factor;
}

exports.getStreakFactor = function() {
	return streak_factor;
}

exports.compete = function(member, question, scoreA) {
	function expectedScore(R1, R2) {
		return 1 / (1 + Math.pow(10, (R2 - R1)/400));
	}
	// scoreA = If member wins: 1, loss: 0
	var scoreB = 1 - scoreA;
	var streak = 0;

	if (scoreA == 1) { // if member wins
		streak = member.streakRight;
		member.streakRight += 1;
		member.streakWrong = 0;
	}
	else {
		streak = member.streakWrong;
		member.streakRight = 0;
		member.streakWrong += 1;
	}

	var t = (scoreA - expectedScore(member.rating, question.rating));
	var Ra = member.rating + k_factor * t + streak_factor * streak * t^2;
	
	var Rb = question.rating + k_factor * (scoreB - expectedScore(question.rating, member.rating));

	member.rating = Ra;
	question.rating = Rb;
}
