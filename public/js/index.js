$('#addLine').click(function() {
	graph.drawLine({
		type: $('#linetype').val(),
		id: $('#lineid').val()
	});
});

window.onload = function() {
	graph.start();
	graph.drawLine({
		type: 'member',
		id: '59054'
	});
};
