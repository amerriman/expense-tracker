(function() {
  'use strict';
  angular.module('com.expensetracker.directives.categories', [])
  .directive('categories', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
    return {
      restrict: 'E',
      templateUrl: '../../templates/categories.html',
      link: function(vm, elem, attrs, modelCtrl){
          vm.category = {
            cat_username: vm.currentUser.username,
            type: 'expense',
            repeat: false
          };
          vm.categories = [];

          vm.error = false;
          vm.message = "";

          function messageTimeout(){
            $scope.success = false;
          }

          vm.toggleCatType = function(type){
            vm.category.type = type;
          };

          vm.addCategory = function(){
            console.log(vm.category, "category?");
            //add it to the database!

            expenseApi.categories.add(vm.category).then(function(resp){
              console.log(resp, "response in the directive");
              vm.categories.push(resp)
              vm.category = {
                cat_username: vm.currentUser.username,
                type: 'expense',
                repeat: false
              };
            }).catch(function(err){
              vm.error = true;
              vm.message("Oooops - something went wrong");
              $timeout(messageTimeout, 3000);
              $log.debug('addCategory', err);
            });
          };






          // $scope.isAuthenticated = function() {
          //   return $auth.isAuthenticated();
          // };

          function init(){
            $log.debug("init categories");
            expenseApi.categories.getAll(vm.currentUser.username).then(function(resp){
              vm.categories = resp;
            }).catch(function(err){
              $log.error('init.categories ', err);
            });



          }

          init();
      }

    };
  }]);
})();

