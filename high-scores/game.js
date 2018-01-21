// game game game code

var container = document.getElementById('game_container');

container.innerHTML = '<h1>High Score List Demo</h1><div class="button-wrapper"><button id="win">Win Game</button> <button id="lose">Lose Game</button></div><div id="high-score-list" class="ms-hidden"></div>';

var currScore;

// helper function for display in case we took an ampersand or accidental angle bracket
// from https://stackoverflow.com/a/4835406
function escapeHtml(text) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', };
    return text.replace(/[&<>]/g, function(m) { return map[m]; });
}

// I didn't use any jQuery in this game so the ajax is more complicated, but not bad.
// displayScores is called by whatever function(s) handle the end of the game

function displayScores(isWin) {
    // isWin is true if this is called from a winning end to the game, and false for a loss.

    // "loading" message in case ajax response is slow
    // in this setup the high score wrapper is hidden via CSS class ms-hidden
    document.getElementById('high-score-list').innerHTML = '<h3>Scores Loading</h3>';
    document.getElementById('high-score-list').className = 'show-scores';

    var scores, highScoreList, newEntry = false;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', encodeURI('includes/ajax.php'));
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('get_scores=true');
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                scores = JSON.parse(xhr.responseText);
                highScoreList = '<form method="post" id="scoreForm"><table><tr><th colspan="2">High Scores</th></tr>';
                // display the scores, with an entry field if current score is good enough (in this case, low; reverse inequality for a true high score list)
                // include a button that makes an AJAX request with set_score = true, plus inits and score
                var newScoreFlag = 0;
                for (i = 0; i < 10 - newScoreFlag; i++) {
                    if (!scores[i]) {
                        if (newScoreFlag === 0 && isWin) {
                            highScoreList += '<tr><td><input type="text" id="initials" name="initials" placeholder="ABC" /></td><td>' + currScore.toString() + '</td></tr>';
                        }
                        break;
                    }
                    if (currScore < scores[i][1] && newScoreFlag === 0 && isWin) {
                        highScoreList += '<tr><td><input type="text" id="initials" name="initials" placeholder="ABC" /></td><td>' + currScore.toString() + '</td></tr>';
                        newScoreFlag = 1;
                    }
                    highScoreList += '<tr><td>' + escapeHtml(scores[i][0]) + '</td><td>' + escapeHtml(scores[i][1]) + '</td></tr>';
                }
                highScoreList += '</table><button id="initials-submit" type="submit">OK</button></form>';
                document.getElementById('high-score-list').innerHTML = highScoreList;
                document.getElementById('high-score-list').className = 'show-scores';
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
}

function submitScore() {
    if (document.getElementById('initials') && document.getElementById('initials').value.length) {
        // submit the score - provided the person entered *something*
        var currInitials = document.getElementById('initials').value;
        // trim initials input into 1-3 non-angle-bracket ascii characters
        currInitials = currInitials.replace(/(<|>|[^\u0020-\u007f])/g, '');
        if (currInitials.length > 3) { currInitials = currInitials.substr(0,3); }
        // default value if that killed the whole entry
        if (currInitials.length === 0) { currInitials = "XXX"; }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI('includes/ajax.php'));
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('initials=' + encodeURIComponent(currInitials) + '&score=' + currScore.toString());
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    document.getElementById('high-score-list').innerHTML = "";
                    document.getElementById('high-score-list').className = 'ms-hidden';
                }
            }
        };
    } else {
        // no new score; just change the class
        document.getElementById('high-score-list').innerHTML = "";
        document.getElementById('high-score-list').className = 'ms-hidden';
    }
}

// win button: generates random integer 1-100
// lose button: simply calls for score display
// score submit button: initiates ajax call if applicable; closes high score panel regardless

document.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.getAttribute('id') === 'win') {
        currScore = Math.floor(100 * Math.random() + 1);
        displayScores(true);
    }
    if (e.target.getAttribute('id') === 'lose') {
        displayScores(false);
    }
    if (e.target.getAttribute('id') === 'initials-submit') {
        submitScore();
    }
}, false);

