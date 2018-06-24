# Utilities

This repo is for boilerplate code and helper functions that aren't big enough to merit separate repos.

### Subfolders

Each has its own readme.
* **ga-boilerplate**: Google Analytics tracking for internal promotions and product lists
* **high-scores**: ajax-accessed database-stored high score list
* **settings**: Terminal and Visual Studio Code settings-type files

### Top-Level Files

* **fix-special-characters.js** and **special-character-cleaning.png** <br />
"Flatten" certain non-ASCII characters to their ASCII equivalent and strip the rest.
* **liquid-yaml-cheatsheet.md** <br />
Syntax and examples for the parts of Liquid and YAML I've found most useful in building Jekyll layouts.
* **query-string-manipulation.js** and **query-string-tester.html** <br />
Read parameters out of the query string and update the browser URL when parameters change, keeping default values out of the query string and coexisting peacefully with additional parameters. To use the test page you'll have to edit the page path appropriately.
