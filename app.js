var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var elo = require('./elo.js');

// define variables here
members = {};
questions = {};

function memberQuestionAttempt(member, question, score) {
	elo.compete(member, question, score);

	member.ratingHistory.push(member.rating);
	question.ratingHistory.push(question.rating);
}

// Start with mysql work here.
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'deltastep',
	password : 'password',
	database : 'deltastep'
});

connection.connect();

connection.query('select id, memberId, questionGroup, answerStatus, hintTakenCount from practice_question_activity', function(err, rows, fields) {
	if (err) throw err;

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

// express work
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/data/', function(req, res) {
	if (req.xhr) {
		console.log(req.query)
		var data = [];
		if (req.query.type == 'member') data = members[req.query.id].ratingHistory;
		else if (req.query.type == 'question') data = questions[req.query.id].ratingHistory;
		res.json({
			label: req.query.type + ' ' + req.query.id,
			data: data
		});
	}
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// catch 404 and forward to error handler
app.use(function(req, res) {
	var err = new Error('Not Found');
	err.status = 404;
	res.send('Check the URL again.');
});

app.listen(4000, function() {
	console.log('Started at port :4000.');
});
