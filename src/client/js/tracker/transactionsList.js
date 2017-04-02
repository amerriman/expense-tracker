app.directive('transactionsList', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/transactionsList.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";
        vm.categoryEditing = false;
        vm.editing = false;


        function messageTimeout(){
          vm.success = false;
        }

        vm.editTransaction = function(transaction){
          if(!transaction) return;
          vm.categoryEditing = true;
          vm.editing = true;
          vm.transaction = angular.copy(transaction);
        };

        function init(){
          $log.debug("init transactionList");

        }

        init();
    }

  };
}]);


