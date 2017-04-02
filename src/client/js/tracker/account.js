// angular.module('com.expensetracker.directives.account', [])
app.directive('account', ["$window", "$timeout", "$location", "$log", "expenseApi", function ($window, $timeout, $location, $log, expenseApi) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/account.html',
    link: function(vm, elem, attrs, modelCtrl){

        vm.error = false;
        vm.message = "";
        vm.newUser = null;
        vm.categoryEditing = false;

        function messageTimeout(){
          vm.error = false;
        }

        //Things we want to be able to adjust on this page -
        // Add users (can't remove though - perhaps can make them inactive?)

        // See categories, and then can click through to add more categories (also, can't delete them, but can make them inactive)

        //add and/or update an email address

        //eventually - change password and add an image?


        vm.addUser = function(user){
          if(!user || !vm.currentUser.username) return;
          vm.users.push(user);
          var userString = vm.users.join();
          var params ={
            users: userString
          };

          expenseApi.user.update(params, vm.currentUser.username).then(function(response){
            vm.newUser = null;
            vm.currentUser.users = response.users.split('');
          }).catch(function(err){
            vm.error = true;
            vm.message("Oooops - something went wrong");
            $timeout(messageTimeout, 3000);
            $log.debug('addUser', err);
          });
        };


        function init(){
          $log.debug("init account");
        }

        init();
    }

  };
}]);
