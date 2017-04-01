// angular.module('com.expensetracker.directives.login', [])
app.directive('login', function () {
  return {
    restrict: 'E',
    templateUrl: '../../templates/login.html',
    controller: ["$rootScope", "$scope", "$auth", "$window", "$timeout", "$location", "$log", "expenseApi", function ($rootScope, $scope, $auth, $window, $timeout, $location, $log, expenseApi) {

        $scope.login = {};
        $scope.error = false;
        $scope.message= "";

        function messageTimeout(){
          $scope.success = false;
        }
        //after successful login - determine whether to direct user to adding expenses, or adding categories
        function postLogin(user){
          //see if user has categories
          expenseApi.categories.getAll(user).then(function(resp){
            if(resp.length === 0){
              $location.path('/account');
            } else {
              $location.path('/');
            }
          }).catch(function(err){
            $log.error('login.categories ', err);
            $location.path('/track');
          });
          // $location.path('/');
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
              $window.localStorage.uid = JSON.stringify(response.data.user.userId);
              $log.debug('login success');
              postLogin(response.data.user.username);
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
              postLogin(response.data.user.username);
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


