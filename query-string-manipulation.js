/* query-string-manipulation: 
Functions to read parameters out of the query string 
and update the browser URL when parameters change, 
keeping default values out of the query string and 
coexisting peacefully with additional parameters. */

var default1 = "default1";
var param1;

/* parseQuery: 
look for parameters in the URL query string
if not found, assign default values */
function parseQuery() {
    var queryString = window.location.search.substr(1);
    // set all parameters to their default values
    param1 = default1;
    if (queryString.length > 0) {
        // if there's a query string, check for each param within it
        var val1 = queryString.match(/.*param1=([^&]+).*/i);
        if (val1) {
            param1 = val1[1];
        }
    }
}

/* updateQuery:
update parameter values in current URL
maintain any other parameter values
keep parameters with default values out of URL */
function updateQuery() {
    var newUrl = window.location.href;
    // clean out valueless parameters to simplify ensuing matching
    newUrl = newUrl.replace(/(.*[?&])param1(&(.*))?$/, "$1$3");
    if (param1 !== default1) {
        if (newUrl.match(/[?&]param1=/)) {
            newUrl = newUrl.replace(/(.*[?&]param1=)[^&]*(.*)/, '$1' + param1 + '$2');
        } else if (newUrl.indexOf('?') > 0) {
            newUrl = newUrl + '&param1=' + param1;
        } else {
            newUrl = newUrl + '?param1=' + param1;
        }
    } else {
        newUrl = newUrl.replace(/(.*[?&])param1=[^&]*&?(.*)/, '$1$2');
    }

    // tidy up
    if (newUrl.match(/[?&]$/)) {
        newUrl = newUrl.slice(0, -1);
    }    
    window.history.pushState('', '', newUrl);
}
