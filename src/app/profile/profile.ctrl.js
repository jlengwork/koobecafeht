(function() {
  'use strict';

  angular
    .module('koobecafeht')
    .controller('profileCtrl', ctrlFn);

  /** @ngInject */
  function ctrlFn(fbSvc, $state) {
    var vm = this;

    var listPrms = fbSvc.pageListing();
    listPrms.then(function(result){
      vm.pageListing = result;
    });

    vm.choose = function(){
      $state.go("main", {pageid:vm.pageChoice})
    }
  }
})();


/*
Example data:

 "data": [
 {
 "access_token": "CAACEdEose0cBAFkxucYQZBg9AcxN9aZBmsCwZCZCI8zZBrrnhwsCqMLHdYcKpQoO2BIeFjpwPrHdeKTciVXslLq6yy7uk2yfrQcjzW9MZBAJOji0vyjvFDxN5LO1erZCdNzNSZAqbYL3u6FJvivB4KZCgi6K33ZCR6SDnbyxUuRmVD7w1samaiLDpAE87ZAc6T8Fkbp4eIrG0gMGAZDZD",
 "category": "Company",
 "name": "Koobecafeht Community",
 "id": "934466086588459",
 "perms": [
 "ADMINISTER",
 "EDIT_PROFILE",
 "CREATE_CONTENT",
 "MODERATE_CONTENT",
 "CREATE_ADS",
 "BASIC_ADMIN"
 ]
 }

 */
