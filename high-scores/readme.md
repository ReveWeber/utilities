# High Score List

Stored in a MySQL database and accessed via JavaScript ajax calls to PHP files.

* index.php: where the game happens; calls style.css and game.js
* game.js: the JS that makes the ajax calls and puts the output into the page appropriately (also runs the game when there is an actual game)
* includes/db.php: holds credentials, separated off so they can be locked down and .gitignored
* includes/functions.php: has functions, separated from ajax.php for clarity
* includes/ajax.php: endpoint for ajax requests; includes db.php and functions.php; consists otherwise entirely of if(isset($_POST['param']){function call} statements

To install, fill in variable values in db.php (database name and user credentials) and ajax.php (table name) and visit `[URL of folder]/includes/ajax.php?install=true`
