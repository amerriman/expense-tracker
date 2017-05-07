app.directive('transactionsList', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'AE',
    templateUrl: '../../templates/transactionsList.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.editing = false;
        vm.error = false;
        vm.transactionSuccess = false;
        vm.message = "";
        vm.successMessage = "";
        vm.expenseRange = 7;

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
            vm.transactionSuccess = true;
            vm.successMessage = "Transaction successfully updated!";
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
              vm.transactionSuccess = false;
              vm.successMessage = "";
            }, 2500);
            vm.editing = false;
          }).catch(function(err){
            vm.error = true;
            vm.message = "Oooops - something went wrong";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction', err);
          });
        };

        vm.deleteTransaction = function(transaction){
          if(!transaction) return;
          if(transaction.id && transaction.id != null){
            expenseApi.transactions.delete(transaction.id).then(function(resp){
              //remove the transaction from the array
              for(var i = 0; i < vm.transactions.length; i++){
                if(vm.transactions[i].id === transaction.id){
                  vm.transactions.splice(i, 1);
                  break;
                }
              }

              vm.transactionSuccess = true;
              vm.successMessage = "Transaction Deleted";

              $timeout(function(){
                vm.transactionSuccess = false;
                vm.successMessage = "";
              }, 2500);

            }).catch(function(err){
              vm.error = true;
              vm.message = "Oooops - something went wrong";
              $timeout(messageTimeout, 3000);
              $log.debug('deleteTransaction', err);
            });
          }
        };

        function init(){
          $log.debug("init transactionList");

        }

        init();
    }

  };
}]);


