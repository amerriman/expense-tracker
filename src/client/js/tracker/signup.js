// angular.module('com.expensetracker.directives.signup', [])
app.directive('signup', function () {
  return {
    restrict: 'E',
    templateUrl: '../../templates/signup.html',
    controller: ["$rootScope", "$scope", "$http", "$auth", "$location", "$timeout", "$window", "$log", "expenseApi", function ($rootScope, $scope, $http, $auth, $location, $timeout, $window, $log, expenseApi) {

      $scope.signup = {};
      $scope.error = false;
      $scope.message= "";

      function messageTimeout(){
        $scope.success = false;
      }

      $scope.register = function() {
        var user = {
          // email: $scope.signup.email,
          password: $scope.signup.password,
          username: $scope.signup.username
        };

        return $auth.signup(user)
          .then(function(response){
            $scope.signup = {};
            $log.debug('register success');
            return $auth.login(user)
              .then(function(response) {
                $scope.login = {};
                $scope.$emit('authenticated', response.data.user);
                $window.localStorage.uid = JSON.stringify(response.data.user.userId);
                $log.debug('login success');
                $location.path('/account');
              })
              .catch(function(response) {
                $scope.error = true;
                $scope.message= "Incorrect username or password";
                $timeout(messageTimeout, 3000);
              });
          })
          .catch(function(response) {
              $scope.error = true;
              $scope.message= "Whoops! The user name you entered is already taken!";
              $timeout(messageTimeout, 3000);
          });
      };

//need better error messaging here for the user/me
      $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
          .then(function(response) {
            if(response.status == 409){
              $scope.error = true;
              $scope.message= response.data.message;
              $timeout(messageTimeout, 3000);
            } else if(response.status == 200){
              $window.localStorage.uid = JSON.stringify(response.data.user.userId);
              $scope.$emit('authenticated', response.data.user);
              $log.debug('google register success');
              $location.path('/account');
            } else {
                $scope.error = true;
                $scope.message= "Hm, something didn't work.  Please try again.";
                $timeout(messageTimeout, 3000);
            }

          })
        .catch(function(response) {
          $scope.error = true;
          $scope.message= "You must be registered with a Gmail account to sign in with Google";
          $timeout(messageTimeout, 3000);
        });
      };

    }],
  };
});
