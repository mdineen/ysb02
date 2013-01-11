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
    
    ko.applyBindings(ScoreboardApplication.scoreboardView, $("#scoreboardregion")[0]);
});