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

window.onload = function() {
	graph.start();

	store.getAllRequests().forEach(function(req) {
		graph.drawLine(req);
	});

	// Change height of history div
	$('#historyDiv').height($('#changeDefaultsDiv').height())
};
