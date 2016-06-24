var mysql = require('mysql');
var elo = require('./elo.js');

var members = {};
var questions = {};

function memberQuestionAttempt(member, question, score) {
	elo.compete(member, question, score);

	member.ratingHistory.push(member.rating);
	question.ratingHistory.push(question.rating);
}

// Start with mysql work here.
function compute() {
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'deltastep',
		password : 'password',
		database : 'deltastep'
	});

	connection.connect();

	connection.query('select id, memberId, questionGroup, answerStatus, hintTakenCount from practice_question_activity', function(err, rows, fields) {
		if (err) throw err;

		members = {};
		questions = {};

		for (var index in rows) {
			var row = rows[index];

			if (!members[row.memberId]) {
				members[row.memberId] = {
					rating: 1400,
					ratingHistory: [1400]
				};
			}

			if (!questions[row.questionGroup]) {
				questions[row.questionGroup] = {
					rating: 1400,
					ratingHistory: [1400]
				};
			}

			if (row.answerStatus == "Right") 
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 1);
			else if (row.answerStatus == "Wrong")
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 0);

		}
	});

	connection.end();
}

compute();

exports.getRatingHistory = function(queryType, id) {
	if (queryType == 'member') return members[id].ratingHistory;
	if (queryType == 'question') return questions[id].ratingHistory;
}

exports.getCurrentRating = function(queryType, id) {
	if (queryType == 'member') return members[id].rating;
	if (queryType == 'question') return questions[id].rating;
}

exports.setKFactor = function(k) {
	elo.setKFactor(k);
	compute();
}
