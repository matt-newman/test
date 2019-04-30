(function () {
    var MONETIZER_SCRIPT_URI = "https://m.skimresources.com/widget/skimlinks/pc/app.bundle.js";
    var SHOP_ID = 984;
    var PUBLISHER_ID = "34784X1585475";

    var MONETIZE_PLACEHOLDER_CLASS = 'monetize-101';
    var TOPIC_TAG_SELECTOR = '.tags__list a[href^="/topic/"]';
    var WIDGET_SELECTOR = '.m101-widget';

    var alreadyHasWidget = document.querySelector('*[data-type="price-comparison"]');
    var alreadyInjectedScript = document.querySelector(`script[src="${MONETIZER_SCRIPT_URI}"]`);
    var isSunSelectsProductPage = /\/sun-selects\/\d+/i.test(document.location.href);
    var topicKeywordsRegex = /tech|motoring/i;

    var injectScript = function () {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = MONETIZER_SCRIPT_URI;
        s.onload = function () {
            new PriceComparison({
                shopId: SHOP_ID,
                pub: PUBLISHER_ID,
                // delta: "40",
                geolocation: false,
                resultLimit: 5,
                template: "default3"
            });
        };
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    };

    var isMatchingTopicPage = function() {
        var topicTags = [].slice.call( document.querySelectorAll( TOPIC_TAG_SELECTOR ) );
        return topicTags.some( ( e ) => { return topicKeywordsRegex.test( e.innerText ); } );
    };

    var findBuyLinks = function () {
        var buyLinks = [];
        var buyLinksSelector = '.article__content ul a';
        var buyTextRegex = /^\s*buy/i;

        buyLinks = [].slice.call(document.querySelectorAll(buyLinksSelector)).filter((item) => {
            return buyTextRegex.test(item.innerText);
        });
        return buyLinks;
    };

    var insertMetaDataHook = function( item ) {
        var dataConfig = {
            "isoCurrencyCode": "GBP",
            "isoLanguageCode": "en"
        };
        // the below were for the previous implementation, using product name and price:
        // var productData = item.parentElement.innerText.match(/(.*?),.*?([\d.]+)\b/);
        // var productName = productData[1];
        // var productPrice = productData[2];
        var productOriginalUri = item.href;

        var tempElement = `<p class="${MONETIZE_PLACEHOLDER_CLASS}" data-type="price-comparison" data-template="thesun" data-config='${ JSON.stringify( dataConfig ) }' data-url='${ productOriginalUri }'></p>`;
        item.closest('ul').insertAdjacentHTML('beforebegin', tempElement);
    };

    var noMoreWidgetsToShow = () => {
        // dataChecked === placeHolder && (placeHolder - buyLinks) === widgets
        var placeHolders = [].slice.call(document.querySelectorAll( `.${MONETIZE_PLACEHOLDER_CLASS}` ));
        var unCheckedPlaceholders = [].slice.call(document.querySelectorAll( `.${MONETIZE_PLACEHOLDER_CLASS}:not([data-checked="true"])` ));
        var remainingBuyLinks = findBuyLinks();
        var widgets = [].slice.call(document.querySelectorAll( WIDGET_SELECTOR ));
        
        return unCheckedPlaceholders.length === 0 && ( ( placeHolders.length - remainingBuyLinks.length ) === widgets.length );
    };

    var removeCTAs = function() {
        var localTimeout;
        var waitTime = 30;

        var checkForThenRemoveCTAs = () => {
            var buyLinks = findBuyLinks();
            clearTimeout( localTimeout );

            if ( buyLinks.length === 0 || noMoreWidgetsToShow() ) {
                return;
            }

            buyLinks.forEach( e => {
                //previous sibling selection works due to using 'beforebegin' insertion in insertMetaDataHook()
                var wrappingListElement = e.closest('ul');
                var isWidgetPresent = wrappingListElement.previousSibling.querySelector( WIDGET_SELECTOR );
                if ( isWidgetPresent ) {
                    wrappingListElement.parentNode.removeChild( wrappingListElement );
                }
            } );

            localTimeout = setTimeout( checkForThenRemoveCTAs, waitTime );
            waitTime = waitTime * 2; // next iteration waits twice as long before firing
        };

        checkForThenRemoveCTAs();
    };

    if (!isSunSelectsProductPage || alreadyHasWidget || alreadyInjectedScript || !isMatchingTopicPage()) {
        return;
    }

    findBuyLinks().forEach( insertMetaDataHook );

    injectScript();

    // remove CTAs when widget appears
    removeCTAs();

})();