
// helper function to make nice promo data out of link destinations
// uses a cleaned-up and subdomain-home-page-friendly path for ID
// and makes a title-type string out of it for Name

function promoDataFromLink(link) {
    // step 1: carve off path and clean slashes
    // if your site is .org, .net etc edit accordingly
    var path = link;
    if (/\.com/.test(path)) {
        path = path.split('.com')[1];
    }
    if (path.startsWith('/')) {
        path = path.slice(1);
    }
    if (path.endsWith('/')) {
        path = path.slice(0, path.length - 1);
    }

    // step 2: account for home page(s)
    // only the final line is necessary if you have no subdomains
    // or if different subdomains go to different GA properties
    if (path === "") {
        var cleanURL = link.split('//')[1];
        var subdomain = cleanURL.split('.')[0];
        if (subdomain !== 'www') {
            path = subdomain + "-";
        }
        path += "home-page";
    }

    // step 3: dissect and reorder path into name
    var linkArray = path.split('/');
    // do as you will to the ordering and naming of path folders here
    // e.g. if your structure were /tags/promos/ you might want "promos tag"
    // example below assumes I'm promoting pages, posts and category archives
    // paths longer than 1 folder would be categoryname/[subcategoryname/]postname
    // or category/categoryname[/subcategoryname]
    if (linkArray.length > 1) {
        var firstEntry = linkArray.shift();
        if (firstEntry === "category") {
            // want categoryname[: subcategoryname] category
            if (linkArray.length > 1) {
                // have a subcategory
                linkArray[0] += ":";
            }
            // tack "category" back onto the end
            linkArray.push(firstEntry);
        } else {
            // want postname (categoryname[: subcategoryname])
            if (linkArray.length > 1) {
                var secondEntry = linkArray.shift();
                linkArray.push('(' + firstEntry + ':');
                linkArray.push(secondEntry + ')');
            } else {
                linkArray.push('(' + firstEntry + ')');
            }
        }
    }

    var linkString = linkArray.join(' ');
    // if you have "joining characters" other than - in your URLs address them here
    linkString = linkString.replace(/-/g, ' ');
    linkString = linkString.replace(/\.html/, '');
    linkString = linkString.charAt(0).toUpperCase() + linkString.slice(1);

    return { promoId: path, promoName: linkString };
}

