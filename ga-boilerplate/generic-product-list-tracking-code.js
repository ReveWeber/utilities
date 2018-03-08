/*
    GA Product List Tracking
*/

// GTM setup: https://developers.google.com/tag-manager/enhanced-ecommerce#product-impressions
// set up clicks and adds likewise (accommodates adding to cart from list)
// we are assuming product list data is not being sent with page load
// doing so will save you hits; waiting for visibility will give you more representative CTRs

function pushProductImpressions(productArray) {
    dataLayer.push({
        'event': "productImpressions",
        'ecommerce': {
            'currencyCode': "USD", // assumes currency is universal to the site
            'impressions': productArray,
        }
    });
}

function pushProductClick(productObj) {
    dataLayer.push({
        'event': "productClick",
        'ecommerce': {
            'click': {
                'actionField': {
                    'list': productObj.list,
                },
                'products': [productObj],
            }
        },
        // don't use a callback to put people on the product page
        // they will get there without it and you will be preventing them
        // from opening products in new tabs

        // 'eventCallback': function () {
        //     return true;
        // }
    });
}

function pushProductAdd(productObj) {
    // this can have a list property or not (product detail page is never a list)
    // so this code looks for one in the productObj and uses it if found
    // although no other non-list code is included :)
    var addObj = {
        'event': "addToCart",
        'ecommerce': {
            'add': {
                'products': [productObj],
            }
        }
    };
    if (productObj.list) {
        addObj.ecommerce.add.actionField = { 'list': productObj.list, };
    }
    dataLayer.push(addObj);
}


// event handler attachers for nonstandard product list markup.
// product objects in productArray sent need to include themselves as a jQuery object, property "webElt"
// plus the properties GA will look for: name, id, position, list name, price, brand, category, variant
// one of those first two is required, the next 2 are required, the rest are optional.
// productViewport, optional, is also a jQuery object, containing the element controlling horizontal visibility
// eg the wrapper on a carousel

// I'm assuming here that anything central enough to have add to cart functionality will not use this

function setAdHocProductHandlers(productArray, productViewport) {
    // click handlers
    jQuery.each(productArray, function(i, val){
        val.webElt.click(function() {
            pushProductClick(val);
        });
    });

    // impressions; fake scroll event handler because the actual scroll event is out of control
    // sends only 1 per product per pageload
    var scrollCheckID = window.setInterval(function () {
        var visible = [];
        var toSplice = [];
        jQuery.each(productArray, function(i, val) {
            var curpro = val.webElt;
            if (window.scrollY > curpro.offset().top + (curpro.height() / 2) - window.innerHeight && window.scrollY < curpro.offset().top + (curpro.height() / 2)) {
                if (!productViewport || (curpro.offset().left + (curpro.width() / 2) > productViewport.offset().left && curpro.offset().left + (curpro.width() / 2) < productViewport.offset().left + productViewport.width() )) {
                    visible.push(val);
                    toSplice.push(i);
                }
            }
        });
        if (visible.length) {
            pushProductImpression(visible);
        }
        for (i = toSplice.length - 1; i >= 0; i--) {
            productArray.splice(toSplice[i], 1);
        }
        if (productArray.length === 0) {
            window.clearInterval(scrollCheckID);
        }
    }, 300);
}



(function($) {

// where the markup is standardized the following constructors and handlers will apply

// markup assumption: each product has a wrapper and those wrappers are inside a container without other contents
// wrapper contains one or more links to the product detail page and (possibly) a button that adds to cart
// container needs attribute data-product-list="product list name"
// wrapper needs remaining information: data-id="product-id" data-name="Product Name" likewise price, brand, category, variant
// and an identifying attribute: data-product="listed-product"

// if you allow more than one of something to be added to the cart from the list you'll have to add that code.

// if your product display markup is nicely standardized you can pull the properties from it rather than duplicating them with data-attributes, but that would require too many assumptions for this code.

$.fn.standardProductObj = function () {
    var productObj = {};
    productObj.position = this.index() + 1;
    productObj.quantity = 1;
    productObj.list = this.parent().attr('data-product-list');
    productObj.brand = this.attr('data-brand');
    productObj.category = this.attr('data-category');
    productObj.variant = this.attr('data-variant');
    productObj.name = this.attr('data-name');
    productObj.price = this.attr('price');
    return productObj;
};

$.fn.standardProductArray = function () {
    var productArray = [];
    $(this).each(function () {
        productArray.push($(this).standardProductObj());
    });
    return productArray;
};

$('document').ready(function () {

    // click handler
    $(document).on('click', '*[data-product="listed-product"] a', function () {
        pushProductClick($(this).standardProductObj());
    });

    // click handler
    $(document).on('click', '*[data-product="listed-product"] button', function () {
        pushProductAdd($(this).standardProductObj());
        // and call your add to cart function as well
    });

    // impression handler - fake scroll event
    // note this requires your products be in the HTML on load even if they are not visible on load.
    // no carousel accommodation in this version but it could be added via markup on the wrapper
    var products = $('*[data-product="listed-product"]');
    if (products) {
        var productArray = [];
        products.each(function () {
            productArray.push($(this));
        });
        var scrollCheckID = window.setInterval(function () {
            var visible = $();
            var toSplice = [];
            $.each(productArray, function(i, val) {
                if (window.scrollY > val.offset().top + (val.height() / 2) - window.innerHeight && window.scrollY < val.offset().top + (val.height() / 2)) {
                    visible = visible.add(val);
                    toSplice.push(i);
                }
            });
            if (visible.length) {
                pushProductImpression(visible.standardProductArray());
            }
            for (i = toSplice.length - 1; i >= 0; i--) {
                productArray.splice(toSplice[i], 1);
            }
            if (productArray.length === 0) {
                window.clearInterval(scrollCheckID);
            }
        }, 300);
    }

});

})( jQuery ); 

