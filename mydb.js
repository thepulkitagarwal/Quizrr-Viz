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

var userLessonId = '126';

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
		id: questionGroup,
		rating: value,
		ratingHistory: [value],
		activityHistory: []
	};
}

function setMemberInitialRating(memberId, lessonId) {
	members[memberId] = {
		id: memberId,
		ratings: {}
	};
}

function setMemberInitialLessonRating(memberId, lessonId) {
	members[memberId].ratings[lessonId] = {
		rating: memberRatingValue,
		ratingHistory: [memberRatingValue],
		activityHistory: []
	};
}

function memberQuestionAttempt(member, question, score, lessonId) {
	var activityString = {
		member: 'q' + question.id + ', ' + questionDifficulty[question.id] + ', ' + question.rating,
		question: 'm' + member.id + ', ' + member.ratings[lessonId].rating,
	}

	elo.compete(member.ratings[lessonId], question, score);

	member.ratings[lessonId].ratingHistory.push(member.ratings[lessonId].rating);
	member.ratings[lessonId].activityHistory.push(activityString.member + '->' + question.rating);

	question.ratingHistory.push(question.rating);
	question.activityHistory.push(activityString.question + '->' + member.ratings[lessonId].rating);
}

function compute() {
	var connection = mysql.createConnection(credentials);

	connection.connect();

	var queryString = 'select id, lessonId, memberId, questionGroup, answerStatus, hintTakenCount from practice_question_activity';
	
	connection.query(queryString, function(err, rows, fields) {
		if (err) throw err;

		members = {};
		questions = {};

		for (var index in rows) {
			var row = rows[index];

			if (!members[row.memberId])
				setMemberInitialRating(row.memberId);
			if (!members[row.memberId].ratings[row.lessonId])
				setMemberInitialLessonRating(row.memberId, row.lessonId);

			if (!questions[row.questionGroup])
				setQuestionInitialRating(row.questionGroup);

			if (row.answerStatus == "Right") 
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 1, row.lessonId);
			else if (row.answerStatus == "Wrong")
				memberQuestionAttempt(members[row.memberId], questions[row.questionGroup], 0, row.lessonId);

		}
	});

	connection.end();
}

getQuestionDifficulties();
compute();

exports.getRatingHistory = function(queryType, id) {
	if (queryType == 'member') return members[id].ratings[userLessonId].ratingHistory;
	if (queryType == 'question') return questions[id].ratingHistory;
}

exports.getActivityHistory = function(queryType, id) {
	if (queryType == 'member') return members[id].ratings[userLessonId].activityHistory;
	if (queryType == 'question') return questions[id].activityHistory;
}

exports.getCurrentRating = function(queryType, id) {
	if (queryType == 'member') return members[id].ratings[userLessonId].rating;
	if (queryType == 'question') return questions[id].rating;
}

exports.setDefaults = function(data) {
	if (data['KFactor']) elo.setKFactor(parseInt(data['KFactor']));

	if (data['memberRating']) memberRatingValue = parseInt(data['memberRating']);

	if (data['questionEasy']) questionRatingValues['Easy'] = parseInt(data['questionEasy']);
	if (data['questionNormal']) questionRatingValues['Normal'] = parseInt(data['questionNormal']);
	if (data['questionDifficult']) questionRatingValues['Difficult'] = parseInt(data['questionDifficult']);

	compute();
}

exports.getDefaults = function() {
	return {
		KFactor: elo.getKFactor(),
		memberRating: memberRatingValue,
		questionEasy: questionRatingValues['Easy'],
		questionNormal: questionRatingValues['Normal'],
		questionDifficult: questionRatingValues['Difficult'],
		lessonId: userLessonId
	};
}

exports.setLessonId = function(data) {
	if (data['lessonId'] || data['lessonId'] == '') {
		userLessonId = data['lessonId'];
	}
}
