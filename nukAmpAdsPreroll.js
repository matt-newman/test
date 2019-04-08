videojs.registerPlugin('nukAmpAdsPreroll', function () {

  console.log("MATT:", "canonicalUri", canonicalUri);
  console.log("MATT:", "document", document);
  console.log("MATT:", "window", window);
  console.log("MATT:", "this", this);
  console.log("MATT:", "links", document.getElementsByTagName('link'));

  var baseUri = document.getElementsByTagName('link')[0].baseURI;

  if ( baseUri.toLowerCase().indexOf('/amp') === -1) {
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

  function getCanonicalUrl() {
    //define a variable to hold the canonical URL
    var url = "https://www.thesun.co.uk/";

    //grab all the link tags in the current page
    var links = document.getElementsByTagName('link');

    //loop through looking for a canonical link
    //use the last one found
    [].slice.apply(links).forEach(function (item) {
      if (item.rel !== 'canonical') {
        return;
      };
      url = item.href;
    });

    return url;
  }

  // Get the query string and un-URL encode it
  myPlayer.ima3.settings.serverUrl = myPlayer.ima3.settings.serverUrl + "&iu=" + getQuerystring("iu") + "&description_url=" + canonicalUri;

});