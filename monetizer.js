(function () {
    var MONETIZER_SCRIPT_URI = "https://m.skimresources.com/widget/skimlinks/pc/app.bundle.js";
    var SHOP_ID=984;
    var PUBLISHER_ID="34784X1585475";
    
    var alreadyHasWidget = document.querySelector('*[data-type="price-comparison"]');
    var alreadyInjectedScript = document.querySelector(`script[src="${MONETIZER_SCRIPT_URI}"]`);
    var isSunSelectsProductPage = /\/sun-selects\/\d+/i.test( document.location.href );

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

    var findThenUpdateBuyLinks = function (func) {
        [].slice.call(document.querySelectorAll('.article__content ul a')).forEach((item, index) => {
            if (/^\s*buy/i.test(item.innerText) === false) {
                // console.log(`item ${index} - didn't match:`, item);
                return;
            }

            var dataConfig = {
                "isoCurrencyCode": "GBP", 
                "isoLanguageCode": "en"
            };
            var productData = item.parentElement.innerText.match(/(.*?),.*?([\d.]+)\b/);
            var productName = productData[1];
            var productPrice = productData[2];
            var productOriginalUri = item.href;

            var tempElement = `<div class="monetize-101" data-type="price-comparison" data-template="thesun" data-config='${ JSON.stringify( dataConfig ) }' data-url='${ productOriginalUri }'></div>`;
            item.insertAdjacentHTML('afterend', tempElement);
        })
    };

    if ( !isSunSelectsProductPage || alreadyHasWidget || alreadyInjectedScript ) {
        return;
    }

    findThenUpdateBuyLinks();
    injectScript();

})();