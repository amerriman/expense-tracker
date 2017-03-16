(function() {
  'use strict';
  angular.module('com.expensetracker.directives.track', [])
  .directive('track', ["$timeout", "$location", "$log", "expenseApi", function ($timeout, $location, $log, expenseApi) {
    return {
      restrict: 'E',
      templateUrl: '../../templates/track.html',
      link: function(vm, elem, attrs, modelCtrl){

          vm.error = false;
          vm.message = "";

          vm.transaction = {
            trans_username: vm.currentUser.username
          };

          function messageTimeout(){
            $scope.success = false;
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

          vm.addTransaction =function(){
            //add it to the database!
            console.log(vm.transaction, "this is the transaction");
            if(!vm.transaction.type || !vm.transaction.category || !vm.transaction.date || !vm.transaction.trans_username || !vm.transaction.amount){
              $log.debug('addTransaction: missing required information');
              return;
            }
            // * make sure the amount is an acutal number
            var amount = parseFloat(vm.transaction.amount);
            if (isNaN(amount)) {
              vm.message = "You must enter a valid transaction amount";
              $timeout(messageTimeout, 3000);
            }
            vm.transaction.amount = parseFloat(vm.transaction.amount.toFixed(2));

            expenseApi.transactions.add(vm.transaction).then(function(resp){
              console.log(resp, "response in the directive");
              //add new transaction to transaction array
              resp.push(vm.transactions);
              vm.transaction = {
                trans_username: vm.currentUser.username,
                type: 'expense',
                category: null,
                repeat: false
              };
              //clear the datepicker
              $('#chosen-date').val( '');
            }).catch(function(err){
              vm.error = true;
              vm.message("Oooops - something went wrong");
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
})();

