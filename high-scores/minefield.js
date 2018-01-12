// game game game code

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
                // display the scores, with an entry field if current score is high enough (in this case, time is low enough; reverse inequality for a true high score list)
                // include a button that makes an AJAX request with set_score = true, plus inits and score
                var timerFlag = 0;
                for (i = 0; i < 10 - timerFlag; i++) {
                    if (!scores[i]) {
                        if (timerFlag === 0 && isWin) {
                            highScoreList += '<tr><td><input type="text" id="initials" name="initials" placeholder="ABC" /></td><td>' + timerValue.toString() + '</td></tr>';
                        }
                        break;
                    }
                    if (timerValue < scores[i][1] && timerFlag === 0 && isWin) {
                        highScoreList += '<tr><td><input type="text" id="initials" name="initials" placeholder="ABC" /></td><td>' + timerValue.toString() + '</td></tr>';
                        timerFlag = 1;
                    }
                    highScoreList += '<tr><td>' + scores[i][0] + '</td><td>' + scores[i][1] + '</td></tr>';
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
    if (document.getElementById('initials')) {
        // submit the score
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI('includes/ajax.php'));
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('initials=' + document.getElementById('initials').value.toString() + '&score=' + timerValue.toString());
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    document.getElementById('high-score-list').innerHTML = "";
                    document.getElementById('high-score-list').className = 'ms-hidden';
                }
            }
        };
    } else {
        // just change the class
        document.getElementById('high-score-list').innerHTML = "";
        document.getElementById('high-score-list').className = 'ms-hidden';
    }
}

document.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.getAttribute('id') == 'initials-submit') {
        submitScore();
    }
}, false);

