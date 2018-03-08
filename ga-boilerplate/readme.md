# Google Analytics Boilerplate Code

Generic code for Enhanced Ecommerce purposes.

* generic-product-list-tracking-code.js <br />
Code for tracking impressions, clicks, and adds to cart of products in product lists where not all products are visible onscreen at page load (hence impressions not sent as payload on the pageview). Assumes Google Tag Manager and jQuery and has versions to track "standardized" product lists (via data-attributes) and "ad hoc" product lists (via passed-in objects).

* generic-promo-tracking-code.js <br />
Code for tracking impressions and clicks of promotions that are not necessarily visible onscreen at page load (hence impressions not sent as payload on the pageview). Assumes Google Tag Manager and jQuery and has versions to track "standardized" promos (via data-attributes) and "ad hoc" promos (via passed-in objects). Note for this that GA docs imply you have to use what you might call "variable-safe" names - in particular, without spaces - for all properties other than the name, but that's not the case. I generally do so for id, but use descriptive phrases for the other three slots.

* promo-data-from-link.js <br />
Helper function to construct a promo ID and promo name from the path of the promo's link.
