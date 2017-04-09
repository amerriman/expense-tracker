// angular.module('com.expensetracker.directives.track', [])
app.directive('track', ["$timeout", "$location", "$log", "expenseApi", function ($timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/track.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.transactionSuccess = false;
        vm.transactionUpdateSuccess = false;
        vm.message = "";
        vm.showAddCategoryForm = false;
        vm.editing = false;

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

        vm.checkAmount = function(user){
          if(vm.transaction && vm.transaction.category && vm.transaction.category.repeat){
            if(vm.transaction.category.repeat_amount && vm.transaction.category.repeat_amount != null)
            amount = parseFloat(vm.transaction.category.repeat_amount);
            if (isNaN(amount)) {
              vm.message = "You must enter a valid transaction amount";
              $timeout(messageTimeout, 3000);
              return;
            } else {
              vm.transaction.amount = amount;
            }
          } else {
            vm.transaction.amount = null;
          }
        };

        vm.setToday = function(){
          vm.transaction.date = moment().format("L");
          //clear the datepicker
            $('#chosen-date').val(vm.transaction.date);
        };

        vm.setYesterday = function(){
          vm.transaction.date = moment().subtract(1, 'days').format("L");
          //clear the datepicker
            $('#chosen-date').val(vm.transaction.date);
        };

        vm.toggleAddCategory = function(){
          vm.showAddCategoryForm === false ? vm.showAddCategoryForm = true : vm.showAddCategoryForm = false;
        };

        vm.$on('HideCategoryForm', function(){
          vm.toggleAddCategory();
        });

        vm.cancelEdit = function(){
          vm.transaction = {
            trans_username: vm.currentUser.username,
            category: null
          };
          $('#chosen-date').val( '');
          vm.editing = false;
        };

        vm.updateTransaction = function(){
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
          //if the date is not an ISO string, format it correctly
          if(vm.transaction.date instanceof Date == false){
            vm.transaction.date = moment(vm.transaction.date, "MM-DD-YYYY").toISOString();
          }

          expenseApi.transactions.update(vm.transaction, vm.transaction.id).then(function(resp){
            //replace old with new transaction in the way
            var updatedTransactions = vm.transactions.filter(function(transaction){
              return transaction.id != resp.id;
            });
            vm.transactionUpdateSuccess = true;
            resp.date = moment.utc(resp.date).format('L');
            updatedTransactions.push(resp);
            vm.transactions = updatedTransactions;
            vm.transaction = {
              trans_username: vm.currentUser.username,
              category: null
            };
            //clear the datepicker
            $('#chosen-date').val( '');
            $timeout(function(){
              vm.transactionUpdateSuccess = false;
            }, 2500);
            vm.editing = false;
          }).catch(function(err){
            vm.error = true;
            vm.message = "Oooops - something went wrong";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction', err);
          });


        };

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
          //if the date is not an ISO string, format it correctly
          if(vm.transaction.date instanceof Date == false){
            vm.transaction.date = moment(vm.transaction.date, "MM-DD-YYYY").toISOString();
          }
          expenseApi.transactions.add(vm.transaction).then(function(resp){

            vm.transactionSuccess = true;
            //add new transaction to transaction array
            resp.date = moment.utc(resp.date).format('L');
            vm.transactions.push(resp);
            vm.transaction = {
              trans_username: vm.currentUser.username,
              category: null
            };
            $timeout(function(){
              vm.transactionSuccess = false;
            }, 2500);

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

