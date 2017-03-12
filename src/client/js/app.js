(function() {
  'use strict';
  angular.module('myApp', [
    'ngRoute',
    'satellizer',
    'com.expensetracker.directives.login',
    'com.expensetracker.directives.signup',
    'com.expensetracker.directives.categories',

    'com.expensetracker.services.api'
    ])

  .controller('mainCtrl',['$scope', '$auth', '$window', '$location', '$log', 'expenseApi', function($scope, $auth, $window, $location, $log,expenseApi){
    var vm = $scope;

    vm.$on('authenticated', function(e, args){
      if($auth.isAuthenticated() && args != null){
        vm.currentUser = args;
      }
    });

    vm.logout = function() {
      $auth.logout();
      delete $window.localStorage.uid;
      vm.currentUser = null;
      $location.path('/');
    };

    vm.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    function init(){
      $log.debug("init: app");
      if(vm.isAuthenticated()){
        var uid = $window.localStorage.uid;
        if(uid != null){
          //get the user
          expenseApi.user.get(uid).then(function(resp){
            vm.currentUser = resp;
            $log.debug('current user set');
            expenseApi.categories.getAll(vm.currentUser.username).then(function(resp){
              if(resp.length === 0){
                //take the user to categories page to set up categories
                $location.path('/categories');
              } else {
                //take user to tracking page
                //$location.path('/track')
              }
            });
          });
        //if uid is null, redirect home
        } else {
          $location.path('/');
        }
      }
    }

    init();


  }])
  .config(['$routeProvider', '$authProvider', '$locationProvider', function($routeProvider, $authProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    // *** satellizer settings ***
    $authProvider.google({
      url: '/auth/google',
      clientId: GOOGLE_CLIENTID,
      redirectUri: window.location.origin
    });


    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        access: {restricted: false}
      })
      .when('/login', {
        templateUrl: '/partials/login.html',
        access: {restricted: false}
      })
      .when('/register', {
        templateUrl: 'partials/signup.html',
        access: {restricted: false}
      })
      .when('/account', {
        templateUrl: 'partials/account.html',
        access: {restricted: true}
      })
      .when('/categories', {
        templateUrl: 'partials/categories.html',
        access: {restricted: true}
      })
      .otherwise('/');




  }]).run(function ($rootScope, $location, $route, $auth) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.access.restricted && !$auth.isAuthenticated()) {
        $location.path('/');
        $route.reload();
      }
    });
  });
})();


