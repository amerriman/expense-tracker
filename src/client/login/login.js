app.directive('login', function () {
  return {
    restrict: 'E',
    templateUrl: '/login/login.html',
    controller: ["$rootScope", "$scope", "$auth", "$window", "$timeout", "$location", function ($rootScope, $scope, $auth, $window, $timeout, $location) {

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
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
              $location.path('/');
              $scope.message = "HOORAY!!!!"
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

        $scope.isAuthenticated = function() {
          return $auth.isAuthenticated();
        };

        $scope.logout = function() {
          $auth.logout();
          delete $window.localStorage.currentUser;
          $location.path('/');
        };

    }],
  };
});

