// angular.module('com.expensetracker.directives.categories', [])
app.directive('categories', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/categories.html',
    link: function(vm, elem, attrs, modelCtrl){
        vm.category = {
          cat_username: vm.currentUser.username,
          type: 'expense',
          repeat: false
        };

        vm.error = false;
        vm.categorySuccess = false;
        vm.message = "";
        vm.categoryEditing = false;
        vm.editing = false;


        function messageTimeout(){
          vm.error = false;
        }

        vm.toggleCatType = function(type){
          vm.category.type = type;
        };

        // vm.editCategory = function(cat){
        //   if(!cat) return;
        //   vm.categoryEditing = true;
        //   vm.editing = true;
        //   vm.category = angular.copy(cat);
        //   if(vm.category.repeat_amount){
        //     vm.category.repeat_amount = parseFloat(vm.category.repeat_amount);

        //   }
        // };

        vm.cancelEdit = function(){
          vm.category = {
            cat_username: vm.currentUser.username,
            type: 'expense',
            repeat: false
          };

          vm.editing = false;
          vm.categoryEditing = false;
          vm.$emit('HideCategoryForm');
        };

        function validateCategory(category){
          if(!category.category_name || !category.type){
            $log.debug("Add Category Error");
            vm.error = true;
            vm.message = "Category name cannot be blank";
            $timeout(messageTimeout, 3000);
            return;
          }

          if(category.repeat_amount){
            category.repeat = true;
            category.repeat_amount = parseFloat(category.repeat_amount);
            if (isNaN(category.repeat_amount)) {
              vm.message = "You must enter a valid amount";
              $timeout(messageTimeout, 3000);
              return;
            }
            category.repeat_amount = parseFloat(category.repeat_amount.toFixed(2));

          } else {
            category.repeat = false;
          }
          return category;
        };

        vm.updateCategory = function(category){
          var cleanCategory = validateCategory(category);
          if(cleanCategory == null) return;
          // {
          //   vm.error = true;
          //   vm.message("Oooops - something went wrong");
          //   $timeout(messageTimeout, 3000);
          //   $log.debug('updateCategory - no call', err);
          //   // vm.editing = false;
          //   // vm.categoryEditing = false;
          //   return;
          // }

          expenseApi.categories.update(cleanCategory).then(function(resp){
            // replace the old with this new version
            var updatedCategories = vm.categories.filter(function(cat){
              return cat.id != resp.id;
            });
            vm.categorySuccess = true;
            updatedCategories.push(resp);
            vm.categories = updatedCategories;
            vm.category = {
              cat_username: vm.currentUser.username,
              type: 'expense',
              repeat: false
            };
            vm.editing = false;
            vm.categoryEditing = false;
            $timeout(function(){
              vm.categorySuccess = false;
            }, 2500);
          }).catch(function(err){
            vm.error = true;
            vm.message("Oooops - something went wrong");
            $timeout(messageTimeout, 3000);
            $log.debug('updateCategory', err);
          });
        };


        vm.addCategory = function(){
          var cleanCategory = validateCategory(vm.category);
          if(cleanCategory == null) return;
          //add it to the database!
          expenseApi.categories.add(cleanCategory).then(function(resp){
            vm.categorySuccess = true;
            vm.categories.push(resp);
            vm.category = {
              cat_username: vm.currentUser.username,
              type: 'expense',
              repeat: false
            };
            $timeout(function(){
              vm.categorySuccess = false;
              vm.$emit('HideCategoryForm');
            }, 2500);
          }).catch(function(err){
            vm.error = true;
            vm.message("Oooops - something went wrong");
            $timeout(messageTimeout, 2500);
            $log.debug('addCategory', err);
          });
        };






        // $scope.isAuthenticated = function() {
        //   return $auth.isAuthenticated();
        // };

        function init(){
          $log.debug("init categories");


        }

        init();
    }

  };
}]);


