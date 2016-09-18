app.directive('signup', function () {
  return {
    restrict: 'E',
    templateUrl: '/signup/signup.html',
    controller: ["$scope", "$http", "$auth", "$location", "$timeout", function ($scope, $http, $auth, $location, $timeout) {

      console.log("Oh hey, here I am");

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
        };
        console.log(user, "USER IN THE SIGN UP")

        $auth.signup(user)
          .then(function(response){
            $scope.signupForm = {};
            $location.path('/login');
          })
          .catch(function(response) {
            console.log(response, "RESPONSE.DATA in signp");
              $scope.error = true;
              $scope.message= "Whoops! The Email you entered is already taken!";
              $timeout(messageTimeout, 3000);
          });
      };

    }],
  };
});

