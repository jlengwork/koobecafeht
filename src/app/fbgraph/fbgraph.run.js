(function() {
  'use strict';

  angular
    .module('fbgraph')
    .run(emptyFn)


  function emptyFn(){

  }

  /** @ngInject */
  function runFn($rootScope, $window) {
  $rootScope.user = {};

    $window.fbAsyncInit = function () {
      // Executed when the SDK is loaded

      FB.init({
        /*
         The app id of the web app;
         To register a new app visit Facebook App Dashboard
         ( https://developers.facebook.com/apps/ )
         */
        appId: '1648673925374696',

        /*
         Adding a Channel File improves the performance
         of the javascript SDK, by addressing issues
         with cross-domain communication in certain browsers.
         */
        channelUrl: '/app/fbgraph/channel.html',

        /*
         Set if you want to check the authentication status
         at the start up of the app
         */
        status: true,

        /*
         Enable cookies to allow the server to access
         the session
         */
        cookie: true,

        /* Parse XFBML */
        xfbml: true
      });
    }
/*
    (function(d){
      // load the Facebook javascript SDK

      var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

      if (d.getElementById(id)) {
        return;
      }

      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "http://connect.facebook.net/en_US/sdk.js";

      ref.parentNode.insertBefore(js, ref);

    }(document));
    */

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "http://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

})();
