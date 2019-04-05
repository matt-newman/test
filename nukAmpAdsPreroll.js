videojs.registerPlugin('nukAmpAdsPreroll', function () {

  if (window.location.href.toLowerCase().indexOf('/amp') === -1) {
    return;
  }

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
    [].slice.apply(links).forEach(function (key) {
      if (key.rel !== 'canonical') {
        return;
      };
      url = key.href;
    });

    return encodeURIComponent(url);
  }

  // Get the query string and un-URL encode it
  myPlayer.ima3.settings.serverUrl = myPlayer.ima3.settings.serverUrl.replace("&iu=", "&iu=" + getQuerystring("iu")).replace(/&description_url=.*?&/, "&description_url=" + getCanonicalUrl() + '&');

});