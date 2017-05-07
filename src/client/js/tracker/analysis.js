// angular.module('com.expensetracker.directives.analize', [])
app.directive('analysis', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/analysis.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";

        function messageTimeout(){
          $scope.error = false;
        }

        vm.toggleRange = function(val){
          if(val == null) {
            return;
          }
          vm.expenseRange = val;
        };


        function init(){
          $log.debug("analize home");
        }

        init();
    }

  };
}]);
