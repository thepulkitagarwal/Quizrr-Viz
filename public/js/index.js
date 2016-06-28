$('#addLine').click(function() {
	var info = {
		type: $('#linetype').val(),
		id: $('#lineid').val()
	};
	if(!store.inStore(info)) {
		store.addData(info);
		graph.drawLine(info);
	}
});

function removeLine(reqStr) {
	store.removeData(reqStr);
	graph.removeLine(reqStr);
}

function getDefaults() {
	// Get Values of K Factor and ratings and put it in the form
	$.ajax({
		url: '/defaults',
		success: function(result) {
			$('#defaults-form').find("input[type=number]").each(function() {
				$(this).attr("placeholder", result[$(this).context.name]);
			});
		},
		error: function(err) {
			console.log(err);
		}
	});
}

window.onload = function() {
	graph.start();

	store.getAllRequests().forEach(function(req) {
		graph.drawLine(req);
	});

	// Change height of history div
	$('#historyDiv').height($('#changeDefaultsDiv').height());

	getDefaults();
};
