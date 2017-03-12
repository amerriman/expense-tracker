(function() {
  'use strict';
  angular.module('com.expensetracker.directives.categories', [])
  .directive('categories', function () {
    return {
      restrict: 'E',
      templateUrl: '../../templates/categories.html',
      controller: ["$scope", "$auth", "$window", "$timeout", "$location", "$log", "expenseApi", function ($rootScope, $scope, $auth, $window, $timeout, $location, $log, expenseApi) {
          var vm = $scope;

          vm.login = {};
          vm.error = false;
          vm.message = "";

          // function messageTimeout(){
          //   $scope.success = false;
          // }
          // $timeout(messageTimeout, 3000);



          // $scope.isAuthenticated = function() {
          //   return $auth.isAuthenticated();
          // };

          function init(){
            // $log.debug('init categories');

          }

          init();

      }],
    };
  });
})();

