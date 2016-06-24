$.ajax({
    url: '/data/',
    data: {
        type: 'member', 
        id: '59054'
    },
    success: function(result) {
        console.log(result);

        var background = randomColor(0.5);
        var newDataset = {
            label: result.label,
            borderColor: background,
            backgroundColor: background,
            pointBorderColor: background,
            pointBackgroundColor: background,
            pointBorderWidth: 1,
            fill: false,
            data: result.data,
        };

        config.data.datasets.push(newDataset);
        window.myLine.update();
    },
    error: function(err) {
        console.log(err);
    }
});

labeller = []//["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
for(var i = 1; i < 100; i += 1) {
    labeller.push(i);
}
var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};
var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};

var config = {
    type: 'line',
    data: {
        labels: labeller,
        datasets: []
    },
    options: {
        responsive: true,
        legend: {
            position: 'bottom',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Question #'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Score'
                }
            }]
        },
        title: {
            display: true,
            text: 'Scores'
        }
    }
};

$.each(config.data.datasets, function(i, dataset) {
    var background = randomColor(0.5);
    dataset.borderColor = background;
    dataset.backgroundColor = background;
    dataset.pointBorderColor = background;
    dataset.pointBackgroundColor = background;
    dataset.pointBorderWidth = 1;
});

window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};
