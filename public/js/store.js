var store = (function() {
	var historyDiv = $('#historyDiv');
	var element = '<div class="input-group" id="history-%data%">'
					+ '<span class="form-control">%data%</span>'
					+ '<span class="input-group-btn">'
					+ '<button class="btn btn-danger destroy" onclick="removeLine(\'%data%\')">x</button>'
					+ '</span>'
				+ '</div>';

	if(!localStorage.history) {
		localStorage.history = JSON.stringify([]);
	}

	var requests = JSON.parse(localStorage.history);
	for(var index in requests) {
		var req = requests[index];
		historyDiv.append(element.replace(new RegExp('%data%', 'g'), req));
	}

	var addData = function(req) {
		if(req.type && req.id && requests.indexOf(req.type + '-' + req.id) == -1) {
			requests.push(req.type + '-' + req.id);
			historyDiv.append(element.replace(new RegExp('%data%', 'g'), req.type + '-' + req.id));
			localStorage.history = JSON.stringify(requests);
		}
	}

	var removeData = function(reqStr) {
		if(reqStr && requests.indexOf(reqStr) > -1) {
			requests.splice(requests.indexOf(reqStr), 1);
			$('#history-' + reqStr).remove();

			localStorage.history = JSON.stringify(requests);
		}
	}

	return {
		addData: addData,
		removeData: removeData
	}
})();
