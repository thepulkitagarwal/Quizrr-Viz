var express = require('express');
var app = express();
var path = require('path');
var mydb = require('./mydb.js')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/data/', function(req, res) {
	if (req.xhr) {
		res.json({
			label: req.query.type + ' ' + req.query.id,
			data: mydb.getRatingHistory(req.query.type, req.query.id)
		});
	}
	else {
		res.send('Blocked Page.');
	}
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
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
