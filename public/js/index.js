$.ajax({
    url: '/data/',
    data: {
        type: 'member', 
        id: '59054'
    },
    success: function(result) {
        graph.drawLine(result);
    },
    error: function(err) {
        console.log(err);
    }
});

$.ajax({
    url: '/data/',
    data: {
        type: 'member', 
        id: '124'
    },
    success: function(result) {
        graph.drawLine(result);
    },
    error: function(err) {
        console.log(err);
    }
});

window.onload = function() {
    graph.start();
};
