videojs.registerPlugin('nukAmpAdsPreroll', function () {
  if ( isAmpPage() === false ) {
    return;
  }

  var canonicalUri = getCanonicalUrl();
  var myPlayer = this;

  function getQuerystring(key, default_) {
    var regex, qs;
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return default_;
    } else {
      return qs[1];
    }
  }

  function isAmpPage() {
    var isAmpPage = getQuerystring( 'amp', false );
    
    console.log('MATT:', "window.location.href", window.location.href);
    console.log('MATT:', "isAmpPage", isAmpPage);

    if ( isAmpPage ) {
      isAmpPage = isAmpPage.split('=')[1] || "";
      isAmpPage = isAmpPage.toLowerCase() !== "false";
    }

    console.log('MATT:', "isAmpPage", isAmpPage);

    return isAmpPage;
  }

  function getCanonicalUrl() {
    //define a variable to hold the canonical URL
    var url = "https://www.thesun.co.uk/";

    var encodedBaseUri = getQuerystring( 'cust_params' );
    var custParams = decodeURIComponent( decodeURIComponent( encodedBaseUri ) );
    url = custParams.split('&url=')[1] || url;
    url = url.split('&')[0];

    console.log('MATT:', "getCanonicalUrl", url);
    return url;
  }

  // Get the query string and un-URL encode it
  myPlayer.ima3.settings.serverUrl = myPlayer.ima3.settings.serverUrl + "&iu=" + getQuerystring("iu") + "&description_url=" + canonicalUri;

});