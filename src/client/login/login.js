app.directive('login', function () {
  return {
    restrict: 'E',
    templateUrl: '/login/login.html',
    controller: ["$scope", function ($scope) {

      console.log("Oh hey, here I am in the login");

    }],
  };
});

