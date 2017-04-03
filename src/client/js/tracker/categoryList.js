// angular.module('com.expensetracker.directives.categoryList', [])
app.directive('categoryList', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/categoryList.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";
        vm.categoryEditing = false;
        vm.editing = false;


        function messageTimeout(){
          vm.success = false;
        }

        vm.editCategory = function(cat){
          if(!cat) return;
          vm.categoryEditing = true;
          vm.editing = true;
          vm.category = angular.copy(cat);
          if(vm.category.repeat_amount){
            vm.category.repeat_amount = parseFloat(vm.category.repeat_amount);
          }
        };

        function init(){
          $log.debug("init categoryList");

        }

        init();
    }

  };
}]);


