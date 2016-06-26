$('#addLine').click(function() {
	var info = {
		type: $('#linetype').val(),
		id: $('#lineid').val()
	};

	store.addData(info);
	graph.drawLine(info);
});

function removeLine(reqStr) {
	store.removeData(reqStr);
}

window.onload = function() {
	graph.start();
	graph.drawLine({
		type: 'member',
		id: '59054'
	});

	// Change height of history div
	$('#historyDiv').height($('#changeDefaultsDiv').height())
};
