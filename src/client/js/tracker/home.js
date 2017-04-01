// angular.module('com.expensetracker.directives.home', [])
app.directive('home', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/home.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";

        function messageTimeout(){
          $scope.success = false;
        }



        function init(){
          $log.debug("init home");
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

