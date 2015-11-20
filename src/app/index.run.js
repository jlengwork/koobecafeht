(function() {
  'use strict';

  angular
    .module('koobecafeht')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
