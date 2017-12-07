/*
    GA Internal Promotion Tracking
    code to accommodate promos you can mark up with data-attributes and promos you can't
    datalayer push functions, event handler attachers, and data-attribute promo object constructors
    non-data-attribute promo objects must be constructed elsewhere and passed in
*/

// GTM setup: https://developers.google.com/tag-manager/enhanced-ecommerce#promo-clicks
// set up impressions likewise; we are assuming the promo is not visible immediately upon page load

function pushPromotionImpression(promoArray) {
    dataLayer.push({
        'event': "promotionImpression",
        'ecommerce': {
            'promoView': {
                'promotions': promoArray
            }
        }
    });
}

function pushPromotionClick(promoObj) {
    dataLayer.push({
        'event': "promotionClick",
        'ecommerce': {
            'promoClick': {
                'promotions': [promoObj]
            }
        }
    });
}

// event handler attachers for nonstandard promotion markup.
// promo objects in promoArray sent need to include themselves as a jQuery object, property "webElt"
// plus the properties GA will look for: id, name, creative, position
// promoViewport, optional, is also a jQuery object, containing the element controlling horizontal visibility
// eg the wrapper on a carousel

function setAdHocPromoHandlers(promoArray, promoViewport) {
    // click handlers
    jQuery.each(promoArray, function(i, val){
        val.webElt.click(function() {
            pushPromotionClick(val);
        });
    });

    // impressions; fake scroll event handler because the actual scroll event is out of control
    // sends only 1 per promo per pageload
    var scrollCheckID = window.setInterval(function () {
        var visible = [];
        var toSplice = [];
        jQuery.each(promoArray, function(i, val) {
            var curpro = val.webElt;
            if (window.scrollY > curpro.offset().top + (curpro.height() / 2) - window.innerHeight && window.scrollY < curpro.offset().top + (curpro.height() / 2)) {
                if (!promoViewport || (curpro.offset().left + (curpro.width() / 2) > promoViewport.offset().left && curpro.offset().left + (curpro.width() / 2) < promoViewport.offset().left + promoViewport.width() )) {
                    visible.push(val);
                    toSplice.push(i);
                }
            }
        });
        if (visible.length) {
            pushPromotionImpression(visible);
        }
        for (i = toSplice.length - 1; i >= 0; i--) {
            promoArray.splice(toSplice[i], 1);
        }
        if (promoArray.length === 0) {
            window.clearInterval(scrollCheckID);
        }
    }, 300);
}



(function($) {

// where the markup is standardized the following constructors and handlers will apply

// standard link markup is the following on the <a> tag of the promo:
// data-promotion="internal-promotion" data-id="promo-id" data-name="Promo Name" data-creative="Creative Name" data-position="Promo Position"

$.fn.standardPromoObj = function () {
    var promoObj = {};
    promoObj.id = $(this).attr('data-id');
    promoObj.name = $(this).attr('data-name');
    promoObj.creative = $(this).attr('data-creative');
    promoObj.position = $(this).attr('data-position');
    return promoObj;
};

$.fn.standardPromoArray = function () {
    var promoArray = [];
    $(this).each(function () {
        promoArray.push($(this).standardPromoObj());
    });
    return promoArray;
};

$('document').ready(function () {

    // click handler
    $(document).on('click', 'a[data-promotion="internal-promotion"]', function () {
        pushPromotionClick($(this).standardPromoObj());
    });

    // impression handler - fake scroll event
    // note this requires your promos be in the HTML on load even if they are not visible on load.
    // no carousel accommodation in this version but it could be added via markup on the wrapper
    var promo = $('a[data-promotion="internal-promotion"]');
    if (promo) {
        var promoArray = [];
        promo.each(function () {
            promoArray.push($(this));
        });
        var scrollCheckID = window.setInterval(function () {
            var visible = $();
            var toSplice = [];
            $.each(promoArray, function(i, val) {
                if (window.scrollY > val.offset().top + (val.height() / 2) - window.innerHeight && window.scrollY < val.offset().top + (val.height() / 2)) {
                    visible = visible.add(val);
                    toSplice.push(i);
                }
            });
            if (visible.length) {
                pushPromotionImpression(visible.standardPromoArray());
            }
            for (i = toSplice.length - 1; i >= 0; i--) {
                promoArray.splice(toSplice[i], 1);
            }
            if (promoArray.length === 0) {
                window.clearInterval(scrollCheckID);
            }
        }, 300);
    }

});

})( jQuery ); 

