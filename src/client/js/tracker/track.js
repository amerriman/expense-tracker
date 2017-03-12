(function() {
  'use strict';
  angular.module('com.expensetracker.directives.track', [])
  .directive('track', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
    return {
      restrict: 'E',
      templateUrl: '../../templates/track.html',
      link: function(vm, elem, attrs, modelCtrl){

          vm.error = false;
          vm.message = "";

          function messageTimeout(){
            $scope.success = false;
          }



          function init(){
            $log.debug("init tack");
            // expenseApi.categories.getAll(vm.currentUser.username).then(function(resp){
            //   vm.categories = resp;
            // }).catch(function(err){
            //   $log.error('init.categories ', err);
            // });

          }

          init();
      }

    };
  }]);
})();

