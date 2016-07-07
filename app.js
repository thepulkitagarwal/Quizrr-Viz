var express = require('express');
var app = express();
var path = require('path');
var mydb = require('./mydb.js');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/data', function(req, res) {
	if (req.xhr) {
		res.json({
			label: req.query.type + '-' + req.query.id,
			data: mydb.getRatingHistory(req.query.type, req.query.id),
			activity: mydb.getActivityHistory(req.query.type, req.query.id)
		});
	}
	else {
		res.send('Blocked Page.');
	}
});

app.get('/defaults', function(req, res) {
	if(req.xhr) {
		res.json(mydb.getDefaults());
	}
});

app.get('/members', function(req, res) {
	var green = req.query.green || 2000;
	var red = req.query.red || 0;

	var members = mydb.getAllMembers();
	var memberStr = 'memberId,lessonId,finalRating<br>';
	Object.keys(members).forEach(function(memberId) {
		Object.keys(members[memberId].ratings).forEach(function(lessonId) {
			var greenDiv = members[memberId].ratings[lessonId].rating >= green;
			var redDiv = members[memberId].ratings[lessonId].rating <= red;

			if (greenDiv) {
				memberStr += '<div style="color:green">';
			}
			else if (redDiv) {
				memberStr += '<div style="color:red">';
			}
			
			memberStr += '"' + memberId +'","' + lessonId + '","' + members[memberId].ratings[lessonId].rating + '"<br>';
			
			if (greenDiv || redDiv) {
				memberStr += '</div>';
			}
		});
	});
	res.send(memberStr);
});

app.get('/questions', function(req, res) {
	var diff = req.query.diff || 1000;
	
	var questions = mydb.getAllQuestions();
	var questionStr = 'questionGroup,initialRating,finalRating<br>';
	Object.keys(questions).forEach(function(questionGroup) {
		var addDiv = Math.abs(questions[questionGroup].ratingHistory[0] - questions[questionGroup].rating) >= diff;
		if (addDiv) {
			questionStr += '<div style="color:red">';
		}
		
		questionStr += '"' + questionGroup + '","' + questions[questionGroup].ratingHistory[0] + '","' + questions[questionGroup].rating + '"<br>';
		
		if (addDiv) {
			questionStr += '</div>';
		}
	});
	res.send(questionStr);
});

// for the form to change k-factor and other values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/change', function(req, res) {
	mydb.setDefaults(req.body);
	res.redirect('/');
});

app.post('/lessonId', function(req, res) {
	mydb.setLessonId(req.body);
	res.redirect('/');
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.log(err);
	res.send('Error. Please Refresh.');
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
