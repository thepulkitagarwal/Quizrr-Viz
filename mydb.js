var mysql = require('mysql');
var elo = require('./elo.js');

var credentials = {
	host     : 'localhost',
	user     : 'deltastep',
	password : 'password',
	database : 'deltastep'
};

var members = {};
var questions = {};

var questionDifficulty = {};
var memberRatingValue = 1400;
var questionRatingValues = {
	'Easy': 1400,
	'Normal': 1400,
	'Difficult': 1400
}

function getQuestionDifficulties() {
	var connection = mysql.createConnection(credentials);

	connection.connect();

	var queryString = 'select distinct questionGroup, difficultyLevel from question_bank';

	connection.query(queryString, function(err, rows, fields) {
		if (err) throw err;

		for(var index in rows) {
			var row = rows[index];

			questionDifficulty[row.questionGroup] = row.difficultyLevel;
		}
	});

	connection.end();
}

function setQuestionInitialRating(questionGroup) {
	var value = questionRatingValues[questionDifficulty[questionGroup]];
	if (!value) value = questionRatingValues['Normal'];

	questions[questionGroup] = {
		rating: value,
		ratingHistory: [value]
	};
}

function setMemberInitialRating(memberId) {
	members[memberId] = {
		rating: memberRatingValue,
		ratingHistory: [memberRatingValue]
	};
}

function memberQuestionAttempt(member, question, score) {
	elo.compete(member, question, score);

	member.ratingHistory.push(member.rating);
	question.ratingHistory.push(question.rating);
}

function compute() {
	var connection = mysql.createConnection(credentials);

	connection.connect();

	var queryString = 'select id, memberId, questionGroup, answerStatus, hintTakenCount from practice_question_activity';

	connection.query(queryString, function(err, rows, fields) {
		if (err) throw err;

		members = {};
		questions = {};

		for (var index in rows) {
			var row = rows[index];

			if (!members[row.memberId]) setMemberInitialRating(row.memberId);
			if (!questions[row.questionGroup]) setQuestionInitialRating(row.questionGroup);

			if (row.answerStatus == "Right") 
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 1);
			else if (row.answerStatus == "Wrong")
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 0);

		}
	});

	connection.end();
}

getQuestionDifficulties();
compute();

exports.getRatingHistory = function(queryType, id) {
	if (queryType == 'member') return members[id].ratingHistory;
	if (queryType == 'question') return questions[id].ratingHistory;
}

exports.getCurrentRating = function(queryType, id) {
	if (queryType == 'member') return members[id].rating;
	if (queryType == 'question') return questions[id].rating;
}

exports.setDefaults = function(data) {
	elo.setKFactor(parseInt(data['KFactor']) || elo.getKFactor());

	memberRatingValue = parseInt(data['memberRating']) || memberRatingValue;

	questionRatingValues = {
		'Easy': parseInt(data['questionEasy']) || questionRatingValues['Easy'],
		'Normal': parseInt(data['questionNormal']) || questionRatingValues['Normal'],
		'Difficult': parseInt(data['questionDifficult']) || questionRatingValues['Difficult']
	}

	compute();
}
