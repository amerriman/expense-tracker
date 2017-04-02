var app = angular.module('myApp', [
  'ngRoute',
  'satellizer',
  // 'com.expensetracker.directives.login',
  // 'com.expensetracker.directives.signup',
  // 'com.expensetracker.directives.categories',
  // 'com.expensetracker.directives.categoryList',
  // 'com.expensetracker.directives.track',
  // 'com.expensetracker.directives.home',
  // 'com.expensetracker.directives.datepicker',
  // 'com.expensetracker.directives.account',

  // 'com.expensetracker.services.api'
  ])

.controller('mainCtrl',['$scope', '$auth', '$window', '$location', '$log', 'expenseApi', function($scope, $auth, $window, $location, $log,expenseApi){
  var vm = $scope;

  vm.categories = [];
  vm.transactions = [];
  vm.users = [];

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
          if(resp.users != null){
            vm.users = resp.users.split(',');
          }
          $log.debug('current user set');
          //get all the transactions before getting all the categories - maybe limit this to...? 100 initially?
          expenseApi.transactions.getAll(vm.currentUser.username).then(function(resp){
            if(resp.length > 0){
              vm.transactions = resp;
              vm.transactions.forEach(function(transaction){
                // $log.debug(transaction, "transaction")
                // $log.debug(transaction.date, "transaction.date")
                transaction.date = moment(transaction.date).format('L');
              });
              $log.debug('transactions set');
            }
            expenseApi.categories.getAll(vm.currentUser.username).then(function(resp){
              if(resp.length === 0){
                //take the user to categories page to set up categories
                $location.path('/account');
              } else {
                vm.categories = resp;
                $log.debug('categories set');
              }
            });
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
    clientId: '481835593158-bs0v4vmh7m7ml5403le4innvim15arc5.apps.googleusercontent.com',
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
    .otherwise('/');




}]).run(function ($rootScope, $location, $route, $auth) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && !$auth.isAuthenticated()) {
      $location.path('/');
      $route.reload();
    }
  });
});

