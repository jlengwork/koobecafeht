(function() {
  'use strict';

  angular
    .module('koobecafeht')
    .controller('loginCtrl', ctrlFn);

  /** @ngInject */
  function ctrlFn(fbSvc, $state) {
    var vm = this;

    vm.start  = function() {
      fbSvc.authenticate().then(
        function (resp) {
          $state.go('profile'); // redirect to page selection
        }
      );
    }
  }
})();
