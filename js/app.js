// Setup 'ga' api
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

// Log a page view and set that as the active page so further events etc appear to come from that page
var ga_pageView = function (page) {
    ga('set', 'page', page);
    ga('send', 'pageview');
};

// Log an initial page view of the entire app ('Default')
ga('create','UA-36371962-9', 'auto');
ga_pageView('/Started');

// Main app
var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
var userDraw = [];
var level = 1;
var speed = 800;
var tutorial = true;

var dialog = function (message, nextState, tutorialOnly) {
    if (tutorialOnly && !tutorial) {
        state(nextState);
    } else {
        $("#dialog").show(200);

        $("#dialogMessage").text(message);
        $("#okayButton").click(function () {
            $(this).unbind("click");
            $("#dialog").hide(200);
            state(nextState);
        });
    }
};

var shuffle = function() {
    var previous = 0;
    var numBlocks = deck.length;
    for (var i = 0; i < numBlocks; i++) {
        var next = parseInt(Math.random() * numBlocks);
        deck[previous] = deck[next] + (deck[next] = deck[previous], 0);
        previous = next;
    }
};

var showBlock = function (blockNumber) {
    if (blockNumber > level) {
        $(".block1").fadeTo(0, 0.3);
        dialog("Tap the blocks in the order they appeared.", 2, true);
        return;
    }
    var blockId = "#" + (deck[blockNumber]).toString();
    $(blockId).addClass("block1");
    setTimeout(function () {
        showBlock(blockNumber + 1);
    }, speed);
};

var state = function (stateNumber) {
    switch (stateNumber) {
        case -1: {
            level = 1;
            $("#dialog").hide();
            dialog("Ready to start?", 0, false);
            break;
        }
        case 0: {
            shuffle();
            $(".square").removeClass("block1");
            dialog("Remember the order in which blocks appear.", 1, true);
            break;
        }
        case 1: {
            ga_pageView('/level' + level.toString());
            setTimeout(function () {
                showBlock(0);
            }, speed);
            break;
        }
        case 2: {
            userDraw = [];
            $(".block1").click(function () {
                $(this).unbind("click");
                $(this).fadeTo(0, 1.0);
                userDraw.push(parseInt(this.id));
                if (userDraw.length == level + 1)
                {
                    setTimeout(function() {state(3)}, 0);
                }
            });
            break;
        }
        case 3: {
            for (var i = 0; i <= level; i++) {
                if (userDraw[i] != deck[i]) {
                    dialog("Wrong, your memory has failed you!", -1, false);
                    return;
                }
            }
            level++;
            tutorial = false;
            if (level == deck.length) {
                ga_pageView('/Completed');
                dialog("You have completed the game and have an amazing memory!", -1, false);
            } else {
                dialog("Well done you've made level "+level.toString()+"!", 0, false);
            }
            break;
        }
    }
};

// Start the game
state(-1);
