(function() {
  'use strict';
  angular.module('com.expensetracker.directives.login', [])
  .directive('login', function () {
    return {
      restrict: 'E',
      templateUrl: '../../templates/login.html',
      controller: ["$rootScope", "$scope", "$auth", "$window", "$timeout", "$location", "$log", function ($rootScope, $scope, $auth, $window, $timeout, $location, $log) {

          $scope.login = {};
          $scope.error = false;
          $scope.message= "";

          function messageTimeout(){
            $scope.success = false;
          }

          $scope.login = function() {
            var user = {
              username: $scope.login.username,
              password: $scope.login.password
            };
  //make these login messages better - especially the errors
            $auth.login(user)
              .then(function(response) {
                $scope.login = {};
                $scope.$emit('authenticated', response.data.user);
                console.log(response.data.user, "response data user")
                $window.localStorage.uid = JSON.stringify(response.data.user.userId);
                $log.debug('login success');
                $location.path('/');
              })
              .catch(function(response) {
                $scope.error = true;
                $scope.message= "Incorrect username or password!";
                $timeout(messageTimeout, 3000);

              });
          };

          $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
              .then(function(response) {
                $scope.$emit('authenticated', response.data.user);
                $window.localStorage.uid = JSON.stringify(response.data.user.userId);
                $log.debug('google login success');
                $location.path('/');
              })
            .catch(function(response) {
              $scope.error = true;
              $scope.message= "You must be registered with a Gmail account to sign in with Google";
              $timeout(messageTimeout, 3000);
            });

          };

          $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
          };

      }],
    };
  });
})();

