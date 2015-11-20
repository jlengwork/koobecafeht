(function() {
  'use strict';

  angular
    .module('koobecafeht')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('homeDemo', {
        url: '/homedemo',
        templateUrl: 'app/main/mainDemo.html',
        controller: 'MainDemoController',
        controllerAs: 'maindemo'
      });

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.tmpl.html',
        controller: 'loginCtrl',
        controllerAs: 'theLoginCtrl'
      });
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.tmpl.html',
        controller: 'profileCtrl',
        controllerAs: 'theProfileCtrl'
      });


    $stateProvider
      .state('main', {
        url: '/main/:pageid',
        templateUrl: 'app/main/main.tmpl.html',
        controller: 'mainCtrl',
        controllerAs: 'theMainCtrl'
      });


    $urlRouterProvider.otherwise('/');
  }

})();
