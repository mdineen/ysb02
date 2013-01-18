require.config({
    paths: {
        'knockout': 'libs/knockout/knockout',
        'text': 'libs/require/text',
        'domReady': 'libs/require/domReady',
        'underscore': 'libs/underscore/underscore'
    }
});

require([
    'knockout',
    'railroadrummy/vms/scoreboard',
    'domReady!'
], function (ko, ScoreboardView) {
    window.ScoreboardApplication = {
        scoreboardView: new ScoreboardView()
    }
    
    ko.applyBindings(ScoreboardApplication.scoreboardView, $("#wrapper")[0]);
    ScoreboardApplication.socket = io.connect('http://sb.dineen.biz:8080');
    ScoreboardApplication.socket.on('completeHand', function (results) {
        console.log('completeHand: ', results);
        ScoreboardApplication.scoreboardView.completeHand(results, false);
    });

});
