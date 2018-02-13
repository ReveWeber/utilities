# Google Analytics Boilerplate Code

Generic code for Enhanced Ecommerce purposes.

* generic-promo-tracking-code.js <br />
Code for tracking impressions and clicks of promotions that are not necessarily visible onscreen at page load (hence impressions not sent as payload on the pageview). Assumes Google Tag Manager and jQuery and has versions to track "standardized" promos (via data-attributes) and "ad hoc" promos (via passed-in promo objects).

* promo-data-from-link.js <br />
Helper function to construct a promo ID and promo name from the path of the promo's link.
