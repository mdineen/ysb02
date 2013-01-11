define([
    'knockout',
    'text!railroadrummy/views/scoreboard.html'
], function (ko, scorboardTemplate) {
    return function () {
        var o = ko.observable;
        this.template = o(scorboardTemplate);
        this.gameData = {
            handIndex: ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"],
            players: [
                {
                    name: o("Player 1"),
                    playing: o(true)
                }, {
                    name: o("Player 2"),
                    playing: o(true)
                }, {
                    name: o("Player 3"),
                    playing: o(true)
                }, {
                    name: o("Player 4"),
                    playing: o(true)
                }
            ],
            hands: [],
            currentHandIndex: o(0),
            currentWild: o("K"),
            currentDealer: o(0),
            handScores: [[o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')], [o('-'), o('-'), o('-'), o('-')]],
            playerTotalScores: [o(0),o(0),o(0),o(0)]
        };
        this.completeHand = function (results) {
            var that = this,
                mappedresults = [],
                playing = _.filter(this.gameData.players, function (p) { return p.playing(); });

            if (results instanceof Array &&
                results.length === playing.length &&
                _.every(results, function (r) { return !isNaN(r); })) {
                mappedresults = results.map(function (r, i) { return { player: i, score: r } });

                //set model values
                this.gameData.hands.push({
                    completed: true,
                    winner: _.sortBy(mappedresults, 'score')[0].player,
                    score: this.gameData.players.map(function (x, i) { return results[i] || 0; })
                });
                this.gameData.currentHandIndex(this.gameData.hands.length);
                this.gameData.currentWild(this.gameData.handIndex[this.gameData.currentHandIndex()]);
                this.gameData.currentDealer(this.gameData.currentHandIndex() % playing.length);
                //set gold winner for hand
                results.forEach(function (r, i) {
                    that.gameData.handScores[that.gameData.currentHandIndex() - 1][i](r);
                    if (!r) {
                        $("div#p-" + i + " #score-" + that.gameData.handIndex[that.gameData.currentHandIndex() - 1]).addClass("winning");
                    }
                })
                //compute total scores 
                playing.forEach(function (player, i) {
                    var playerScores = that.gameData.handScores.map(function (hand) {
                        return hand[i]();
                    });
                    that.gameData.playerTotalScores[i](playerScores.reduce(function (accum, cur) {
                        return accum + (isNaN(cur) ? 0 : cur);
                    }));
                });
                //UI hackery
                $("#hl-" + this.gameData.handIndex[this.gameData.currentHandIndex() - 1]).removeClass("currenthand");
                $("#hl-" + this.gameData.handIndex[this.gameData.currentHandIndex()]).addClass("currenthand");
                var cd = this.gameData.currentDealer();
                $("#p-" + (cd > 0 ? cd - 1 : playing.length - 1)).removeClass("dealer");
                $("#p-" + this.gameData.currentDealer()).addClass("dealer");
                //set gold winning for game
                $("div#total").removeClass("winning");
                var winningPlayer = _.sortBy($("div#total").map(function (i, el) { return { player: i, score: parseInt($(el).text()) }; }), 'score')[0].player;
                $("div#p-" + winningPlayer + " div#total").addClass("winning");
            }
        };
        
    };
});