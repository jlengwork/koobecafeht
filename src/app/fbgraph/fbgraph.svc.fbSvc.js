(function () {
  'use strict';

  angular
    .module('fbgraph')
    .factory('fbSvc', svcFn);

  /** @ngInject */
  function svcFn($q, $timeout, $log) {
    var vm = this;
    vm.user = {};
    vm.permissions = {};
    vm.permsAreGood = false;

    var svc = {
      getUser: function () {
        return vm.user

      }

      , getPermissions: function () {
        return vm.permissions;
      }

      , getPermsAreGood: function () {
        return vm.permsAreGood;
      }


      , getPageInfo: function (pageid) {
        return svc.getBasicFBData('/' + pageid, true);
      }


      , getPostList: function (endpoint) {
        var defer = $q.defer();
        var prms = svc.getBasicFBData(endpoint);
        prms.then(function (data) {
          for (var i = 0; i < data.length; i++) {
            (function (origDataObj) {
              var prms2 = svc.insightPostImpressionsUnique(origDataObj.id);
              prms2.then(function (value) {
                origDataObj.insight = value;
              });  // close prms2

            })(data[i]); // close iify
          }// close for
          defer.resolve(data);
        });
        return defer.promise;
      }

      , getPublishedPostList: function (pageid) {
        return svc.getPostList('/' + pageid + '/posts');

      }

      , getUnpublishedPostList: function (pageid) {
        return svc.getPostList('/' + pageid + '/promotable_posts?fields=scheduled_publish_time,message,created_time&is_published=false');
      }

      , getPost: function (postid) {
        return svc.getBasicFBData('/' + postid, true);
      }

      , postPost: function (pageid, postObj) {
        $log.log("Posting to " + pageid + " with " + JSON.stringify(postObj));
        var defer = $q.defer();
        var pageTokenPrms = svc.getPageToken(pageid);
        var authPrms = svc.authenticate()

        $q.all([pageTokenPrms, authPrms]).then(function (data) {
          var endpt = '/' + pageid + "/feed";
          var params = {};
          params.message = postObj.message;
          params.access_token=data[0];
          if (postObj.countryChoice && postObj.countryChoice!=""){
            params.feed_targeting = {countries:[postObj.countryChoice]}
          }
          if (!postObj.shouldPublish) {
            params.is_published = false;
            params.published = false;
            if (postObj.shouldSchedule){
              params.scheduled_publish_time=postObj.publishDate.getTime()/1000;
            }
          }

          FB.api(endpt, "POST", params, function (resp) {
            $log.debug("-----POST Resp"+JSON.stringify(resp));

            if (resp.error){
              $log.error("-----POST Resp"+JSON.stringify(resp));

              defer.reject(resp);
            }else {
              defer.resolve(resp);
            }
          })
        });
        return defer.promise;
      }


      , insightPostImpressionsUnique: function (postid) {
        var defer = $q.defer();
        var prms = svc.getBasicFBData('/' + postid + '/insights/post_impressions_unique');
        prms.then(function (data) {
          defer.resolve(data[0].values[0].value);
        });
        return defer.promise;
      }

      , getBasicFBData: function (requestStr, getRaw) {
        var defer = $q.defer();
        svc.authenticate().then(function () {
          var cb = function (resp) {
            if (getRaw) {
              defer.resolve(resp);
            } else {
              defer.resolve(resp.data);
            }
          }

          FB.api(requestStr, cb);
        });
        return defer.promise;
      }







      /* Get Page Listing */
      , pageListing: function () {
        var defer = $q.defer();
        var userPrms = svc.authenticate();
        userPrms.then(function (resp) {
          svc.getAccountsListing().then(function (acctResp) {

            if (acctResp.data != undefined) {
              var refData = acctResp.data;
              var respArray = [];
              for (var i = 0; i < refData.length; i++) {
                if (refData[i].perms != undefined) {
                  var refPerms = refData[i].perms;
                  for (var k = 0; k < refPerms.length; k++) {
                    if (refPerms[k] == 'ADMINISTER' || refPerms[k] == 'CREATE_CONTENT') {
                      respArray.push(refData[i]);
                      break;
                    }
                  }
                }
              }
              defer.resolve(respArray);
            } else {
              defer.reject({message: "No data found"});
            }
          });
        });

        return defer.promise;
      }

      , getAccountsListing: function () {
        var defer = $q.defer();
        var userPrms = svc.authenticate();
        userPrms.then(function () {

          FB.api('/me/accounts', function (resp) {
            defer.resolve(resp);
            $log.debug("----accounts: " + JSON.stringify(resp));
            vm.accountList = resp.data;
          });
        });
        return defer.promise;
      }

      , getPageToken : function (pageid){
        var defer = $q.defer();
        var getToken = function(accountList){
          for (var i=0; i<accountList.length; i++){
            if (accountList[i].id==pageid){
              return accountList[i].access_token;
            }
          }
        };

        if (!vm.accountList){
            svc.getAccountsListing().then(function(result){
               defer.resolve(getToken(vm.accountList));
            })
        }else{
          defer.resolve(getToken(vm.accountList));
        }
        return defer.promise;
      }

      /*** use authenticate promise for everything ***/


      /* Login Stuff */
      //TODO: refactor to it's own service

      ,
      authenticate: function () {
        var deferred = $q.defer();
        svc.getLoginStatus().then(function (resp) {
          if (resp.status === 'connected') {
            if (vm.permsAreGood) {
              deferred.resolve(resp);
            } else {
              svc.checkPermissions().then(function (permResp) {
                deferred.resolve(resp);
                $log.debug("-----loginstatus" + JSON.stringify(resp));
                $log.debug("-----Permissions" + JSON.stringify(permResp));
              });
            }
          } else {
            svc.login().then(function (resp2) {
              deferred.resolve(resp2);
            })
          }
        });

        return deferred.promise;
      }

      ,
      getLoginStatus: function () {
        var deferred = $q.defer();
        svc.getFBPromise().then(function () {
          FB.getLoginStatus(function (response) {
            deferred.resolve(response);
          });
        });

        return deferred.promise;
      }

      ,
      checkPermissions: function () {
        var defer = $q.defer();
        var cb = function (resp) {
          var chkManage = false;
          var chkPublish = false;
          var chkPublishActions = false;
          var chkInsight = false;
          var data = resp.data;
          for (var i = 0; i < data.length; i++) {
            var perm = data[i].permission;
            var status = data[i].status;
            if (perm === 'manage_pages' && status === 'granted') {
              chkManage = true;
            } else if (perm === 'publish_pages' && status == 'granted') {
              chkPublish = true;
            } else if (perm === 'publish_actions' && status == 'granted') {
              chkPublishActions = true;
            } else if (perm === 'read_insights' && status == 'granted') {
              chkInsight = true;
            }
          }
          if (!chkManage || !chkPublish || !chkPublishActions || !chkInsight) {
            svc.login();
          } else {
            vm.permsAreGood = true;
            vm.permissions = resp.data;
            defer.resolve(resp);
          }
        }


        FB.api('/me/permissions', cb);

        return defer.promise;
      }

      ,
      login: function () {
        var deferred = $q.defer();
        FB.login(function (resp) {
          deferred.resolve(resp);
        }, {scope: "manage_pages,publish_pages,publish_actions,read_insights"});
        return deferred.promise;
      }

      ,
      getMyLastName: function () {
        var deferred = $q.defer();
        FB.api('/me', {
          fields: 'last_name'
        }, function (response) {
          if (!response || response.error) {
            deferred.reject('Error occured');
          } else {
            deferred.resolve(response);
          }
        });
        return deferred.promise;
      }


      ,
      getPosts: function () {
        var deferred = $q.defer();
        FB.api();
      }


      // Check FB status and poll if necessary
      ,
      getFBPromise: function () {
        var defer = $q.defer();

        if (typeof FB == 'undefined') {
          var poll = function () {
            $timeout(function () {
              if (typeof FB != 'undefined') {
                defer.resolve(FB);
                $log.log("Poll: FB Got Defined!");
              } else {
                $log.log("Poll: FB is undefined");
                poll();
              }

            }, 250);
          };

          poll();

        } else {
          defer.resolve(FB);
        }
        return defer.promise;
      }//end getFBPromise


    } // end svc obj

    return svc;
  }

})();
