app.directive('login', function () {
  return {
    restrict: 'E',
    templateUrl: '/login/login.html',
    controller: ["$rootScope", "$scope", "$auth", "$window", "$timeout", "$location", function ($rootScope, $scope, $auth, $window, $timeout, $location) {

      console.log("Oh hey, here I am in the login");

        $scope.login = {};
        $scope.error = false;
        $scope.message= "";

        function messageTimeout(){
          $scope.success = false;
        }

        $scope.login = function() {
          var user = {
            email: $scope.login.email,
            password: $scope.login.password
          };

          $auth.login(user)
            .then(function(response) {
              console.log(response, "response in the login");
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
              console.log($rootScope.currentUser, "rootscope current user???");
              $location.path('/');
            })
            .catch(function(response) {
              console.log(response, "response in the catch for login");
              $scope.error = true;
              $scope.message= "Incorrect email or password!";
              $timeout(messageTimeout, 3000);

            });
        };

        $scope.authenticate = function(provider) {

          $auth.authenticate(provider)
            .then(function(response) {
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
              console.log($rootScope.currentUser, "Root scope current user in the authenticate");
              console.log(response, "response in the authenticate");
              $location.path('/');
            })
          .catch(function(response) {
            console.log(response, "response in the authenticate CATCH");
            $scope.error = true;
            $scope.message= "You must be registered with a Gmail account to sign in with Google";
            $timeout(messageTimeout, 3000);
          });

        };

        $scope.isAuthenticated = function() {
            console.log("HERE in isAuthenticated")
          console.log($rootScope.currentUser, "Root scope current user in isAuthenticated");
          return $auth.isAuthenticated();
        };

        $scope.logout = function() {
          console.log("HERE IN THE LOGOUT");
          $auth.logout();
          delete $window.localStorage.currentUser;
          $location.path('/');
        };

    }],
  };
});

