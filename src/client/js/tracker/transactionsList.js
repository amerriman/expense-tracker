app.directive('transactionsList', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'AE',
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
          var selectedCategory;
          vm.transaction = angular.copy(transaction);
          $('#chosen-date').val(vm.transaction.date);
          vm.transaction.amount = parseFloat(vm.transaction.amount);
          if(vm.categories && vm.categories.length > 0){
            selectedCategory = vm.categories.filter(function(cat){
              return cat.category_name === vm.transaction.category;
            });
          }
          if(selectedCategory.length === 1){
            vm.transaction.category = selectedCategory[0];
          }

        };

        function init(){
          $log.debug("init transactionList");

        }

        init();
    }

  };
}]);


