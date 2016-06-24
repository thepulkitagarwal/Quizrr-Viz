var k_factor = 32;

exports.defineKFactor = function(k) {
	k_factor = k;
}

exports.compete = function(objectA, objectB, scoreA) { 
	function expectedScore(R1, R2) {
		return 1 / (1 + Math.pow(10, (R2 - R1)/400));
	}
	// scoreA = If a wins: 1, loss: 0
	var scoreB = 1 - scoreA;

	var Ra = objectA.rating + k_factor * (scoreA - expectedScore(objectA.rating, objectB.rating));
	var Rb = objectB.rating + k_factor * (scoreB - expectedScore(objectB.rating, objectA.rating));

	objectA.rating = Ra;
	objectB.rating = Rb;
}
