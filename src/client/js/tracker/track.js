// angular.module('com.expensetracker.directives.track', [])
app.directive('track', ["$timeout", "$location", "$log", "expenseApi", function ($timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/track.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";
        vm.showAddCategoryForm = false;

        vm.transaction = {
          trans_username: vm.currentUser.username
        };

        function messageTimeout(){
          vm.error = false;
        }

        vm.setCategory = function(cat){
          if(!cat){
            delete vm.transaction.type;
            delete vm.transaction.category;
          }
          if(cat){
            vm.transaction.type = cat.type;
            vm.transaction.category = cat.category_name;
          }
        };

        vm.setUser = function(user){
          if(!user){
            delete vm.transaction.user_indiv;
          }
          if(user){
            vm.transaction.user_indiv = user;
          }
        };

        vm.setToday = function(){
          vm.transaction.date = moment().format("L");
        };

        vm.setYesterday = function(){
          vm.transaction.date = moment().subtract(1, 'days').format("L");
        };

        vm.toggleAddCategory = function(){
          vm.showAddCategoryForm === false ? vm.showAddCategoryForm = true : vm.showAddCategoryForm = false;
        };

        vm.$on('HideCategoryForm', function(){
          vm.toggleAddCategory();
        });

        vm.addTransaction =function(){
          if(vm.transaction.category){
            vm.transaction.type = vm.transaction.category.type;
            vm.transaction.category = vm.transaction.category.category_name;
          }
          if(!vm.transaction.type || !vm.transaction.category || !vm.transaction.date || !vm.transaction.trans_username || !vm.transaction.amount){
            vm.error = true;
            vm.message = "Missing required information";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction: missing required information');
            return;
          }
          // * make sure the amount is an acutal number
          var amount = parseFloat(vm.transaction.amount);
          if (isNaN(amount)) {
            vm.message = "You must enter a valid transaction amount";
            $timeout(messageTimeout, 3000);
            return;
          }
          vm.transaction.amount = parseFloat(vm.transaction.amount.toFixed(2));
          expenseApi.transactions.add(vm.transaction).then(function(resp){
            //add new transaction to transaction array
            vm.transactions.push(resp);
              vm.transaction = {
                trans_username: vm.currentUser.username,
                category: null
              };

            //clear the datepicker
            $('#chosen-date').val( '');
          }).catch(function(err){
            vm.error = true;
            vm.message = "Oooops - something went wrong";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction', err);
          });

        };


        function init(){
          $log.debug("init track");
        }

        init();
    }

  };
}]);

