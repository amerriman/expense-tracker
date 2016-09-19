app.directive('signup', function () {
  return {
    restrict: 'E',
    templateUrl: '/signup/signup.html',
    controller: ["$rootScope", "$scope", "$http", "$auth", "$location", "$timeout", "$window", function ($rootScope, $scope, $http, $auth, $location, $timeout, $window) {

      $scope.signup = {};
      $scope.error = false;
      $scope.message= "";

      function messageTimeout(){
        $scope.success = false;
      }

      $scope.register = function() {
        var user = {
          email: $scope.signup.email,
          password: $scope.signup.password,
          username: $scope.signup.username
        };

        $auth.signup(user)
          .then(function(response){
            $scope.signup = {};
            $location.path('/login');
          })
          .catch(function(response) {
              $scope.error = true;
              $scope.message= "Whoops! The Email you entered is already taken!";
              $timeout(messageTimeout, 3000);
          });
      };

      $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
          .then(function(response) {
            $window.localStorage.currentUser = JSON.stringify(response.data.user);
            $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            $location.path('/');
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

