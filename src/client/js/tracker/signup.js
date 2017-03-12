(function() {
  'use strict';
  angular.module('com.expensetracker.directives.signup', [])
  .directive('signup', function () {
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

        function postLogin(user){
          //see if user has categories
        expenseApi.categories.getAll(user).then(function(resp){
            if(resp.length === 0){
              $location.path('/categories');
            } else {
              $location.path('/track');
            }
          }).catch(function(err){
            $log.error('login.categories ', err);
            $location.path('/');
          });
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
                  postLogin(reponse.data.user.usernam);
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
                postLogin(response.data.user.username);
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
})();
