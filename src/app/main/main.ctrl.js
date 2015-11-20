(function() {
  'use strict';

  angular
    .module('koobecafeht')
    .controller('mainCtrl', ctrlFn);

  /** @ngInject */
  function ctrlFn(fbSvc, $stateParams, $alert, moment, $log) {
    var vm = this;
    vm.pageid = $stateParams.pageid;


    fbSvc.getAccountsListing().then(function(data){
      vm.accounts=data;
    });

    fbSvc.getPageInfo(vm.pageid).then(function(data){
      vm.pageInfo = data;
    });

    vm.refreshPosts = function() {
      fbSvc.getPublishedPostList(vm.pageid).then(function (data) {
        vm.publishedPostList = data;
      });
      fbSvc.getUnpublishedPostList(vm.pageid).then(function(data){
        vm.unpublishedPostList = data;
      });
    }

    vm.refreshPosts();

    vm.setCurPost = function(curPostID){
      vm.error = false;
      vm.curPostID = curPostID;
      fbSvc.getPost(curPostID).then(function(data){
        vm.curPost = data;
      });
    }

    vm.newPost = function(){
      vm.error=false;
      vm.curPost = {};
      vm.curPost.isNew = true;
      vm.curPost.shouldPublish = true;
    }

    vm.post = function(){
      vm.error = false;
      vm.posting = true;
      var prms = fbSvc.postPost(vm.pageid, vm.curPost);
      prms.then(function(resp){
        vm.postresults = resp;
        vm.refreshPosts();
        vm.posting=false;
        vm.curPost = undefined;
        $alert({title: 'Post Successful!', content: "Post listings should be updated soon...", placement: 'top', type: 'success', show: true, container:'#alert-anchor'});
      });
      prms.catch(function(err){
        vm.posting=false;
        vm.curPost = undefined;
        vm.error = err.error.message;
        $alert({title: 'Error Posting!', content: vm.error, placement: 'top', type: 'danger', show: true, container:'#alert-anchor'});
      });
    }


    vm.countryChange = function(){
      $log.debug("Chosen Country is currently: "+vm.countryChoice );
    }
  }

  })();
