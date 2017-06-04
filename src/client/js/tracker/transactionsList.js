app.directive('transactionsList', ["$timeout", "$log", "expenseApi", "dateService", function ($timeout, $log, expenseApi, dateService) {
  return {
    restrict: 'AE',
    templateUrl: '../../templates/transactionsList.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.editing = false;
        vm.error = false;
        vm.rangeError = false;
        vm.transactionSuccess = false;
        vm.updateSuccess = false;
        vm.message = "";
        vm.successMessage = "";
        vm.expenseRange = 7;
        vm.posting = false;
        vm.displayTransactions = vm.transactions;

        function messageTimeout(){
          vm.error = false;
          vm.rangeError = false;
          vm.message = "";
          vm.successMessage = "";
        }
        vm.editTransaction = function(transaction){
          if(!transaction) return;
          vm.categoryEditing = true;
          vm.editing = true;
          var selectedCategory;
          vm.editTran = angular.copy(transaction);
          $('#chosen-date-edit').val(vm.editTran.date);
          $('#chosen-date-edit-sm').val(vm.editTran.date);
          vm.editTran.amount = parseFloat(vm.editTran.amount);
          if(vm.categories && vm.categories.length > 0){
            selectedCategory = vm.categories.filter(function(cat){
              return cat.category_name === vm.editTran.category;
            });
          }
          if(selectedCategory.length === 1){
            vm.editTran.category = selectedCategory[0];
          }
        };

        vm.setEditToday = function(){
          vm.editTran.date = moment().format("L");
          $('#chosen-date-edit').val(vm.editTran.date);
          $('#chosen-date-edit-sm').val(vm.editTran.date);
        };

        vm.setEditYesterday = function(){
          vm.editTran.date = moment().subtract(1, 'days').format("L");
          $('#chosen-date-edit').val(vm.editTran.date);
          $('#chosen-date-edit-sm').val(vm.editTran.date);
        };

        vm.toggleRange = function(val){
          if(val == null) {
            return;
          }
          vm.expenseRange = val;
          if(vm.expenseRange != 'other'){
            vm.displayTransactions = vm.transactions;
          } else {
            vm.displayTransactions = [];
            vm.rangeStart = null;
            vm.rangeEnd = null;
          }
        };

        vm.getRange = function(start, end){
          if(!start || !end){
            vm.rangeError = true;
            vm.message = "Must have start and end dates";
            $timeout(messageTimeout, 3000);
            $log.debug('getRange: missing start or end date');
            return;
          }
          vm.rangeStart = start;
          vm.rangeEnd = end;
          dateService.customRange(start, end, vm.currentUser.username).then(function(resp){
            vm.formatTransactionDates(resp);
          });
        };

        vm.formatTransactionDates = function(transactions){
          transactions.forEach(function(t){
            t.date = moment.utc(t.date).format('L');
          });
          vm.displayTransactions = transactions;
        };

        vm.updateTransaction = function(transaction){

          if(transaction.category){
            transaction.type = transaction.category.type;
            transaction.category = transaction.category.category_name;
          }

          if(!transaction.type || !transaction.category || !transaction.date || !transaction.trans_username || !transaction.amount){
            vm.error = true;
            vm.message = "Missing required information";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction: missing required information');
            return;
          }

          // * make sure the amount is an acutal number
          var amount = parseFloat(transaction.amount);
          if (isNaN(amount)) {
            vm.message = "You must enter a valid transaction amount";
            $timeout(messageTimeout, 3000);
            return;
          }
          vm.posting = true;
          transaction.amount = parseFloat(transaction.amount.toFixed(2));
          //if the date is not an ISO string, format it correctly
          if(transaction.date instanceof Date == false){
            transaction.date = moment(transaction.date, "MM-DD-YYYY").toISOString();
          }

          expenseApi.transactions.update(transaction, transaction.id).then(function(resp){
            //replace old with new transaction in the way
            var updatedTransactions = vm.transactions.filter(function(t){
              return t.id != resp.id;
            });
            var updatedDisplayTransactions = vm.displayTransactions.filter(function(t){
              return t.id != resp.id;
            });
            vm.updateSuccess = true;
            vm.successMessage = "Transaction successfully updated!";
            resp.date = moment.utc(resp.date).format('L');
            updatedTransactions.push(resp);
            updatedDisplayTransactions.push(resp);
            vm.displayTransactions = updatedDisplayTransactions;
            vm.transactions = updatedTransactions;

            $timeout(function(){
              vm.updateSuccess = false;
              vm.successMessage = "";
              vm.posting = false;
              $('#editTransaction').modal('hide');
            }, 2500);
            vm.editing = false;
          }).catch(function(err){
            vm.error = true;
            vm.posting = false;
            vm.message = "Oooops - something went wrong";
            $timeout(messageTimeout, 3000);
            $log.debug('addTransaction', err);
          });
        };

        vm.deleteTransaction = function(transaction){
          if(!transaction) return;
          if(transaction.id && transaction.id != null){
            vm.posting = true;
            expenseApi.transactions.delete(transaction.id).then(function(resp){
              //remove the transaction from the main array
              for(var i = 0; i < vm.transactions.length; i++){
                if(vm.transactions[i].id === transaction.id){
                  vm.transactions.splice(i, 1);
                  break;
                }
              }
              //remove the transaction from the visible array
              for(var i = 0; i < vm.displayTransactions.length; i++){
                if(vm.displayTransactions[i].id === transaction.id){
                  vm.displayTransactions.splice(i, 1);
                  break;
                }
              }

              vm.updateSuccess = true;
              vm.successMessage = "Transaction Deleted";
              // //clear the datepicker
              // $('#chosen-date-edit').val( '');
              // vm.editTransaction = null;

              $timeout(function(){
                vm.updateSuccess = false;
                vm.posting = false;
                vm.successMessage = "";
                $('#editTransaction').modal('hide');
              }, 2500);

            }).catch(function(err){
              vm.error = true;
              vm.posting = false;
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


