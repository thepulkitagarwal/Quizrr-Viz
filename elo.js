var k_factor = 32;

exports.setKFactor = function(k) {
	k_factor = k;
}

exports.compete = function(member, question, scoreA) { 
	function expectedScore(R1, R2) {
		return 1 / (1 + Math.pow(10, (R2 - R1)/400));
	}
	// scoreA = If a wins: 1, loss: 0
	var scoreB = 1 - scoreA;

	var Ra = member.rating + k_factor * (scoreA - expectedScore(member.rating, question.rating));
	var Rb = question.rating + k_factor * (scoreB - expectedScore(question.rating, member.rating));

	member.rating = Ra;
	question.rating = Rb;
}
