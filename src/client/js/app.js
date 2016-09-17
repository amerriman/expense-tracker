var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

  // *** satellizer settings ***
  // $authProvider.google({
  //   url: '/auth/google',
  //   clientId: '481835593158-qnuddr7o808dfveslk68n6ang1pd1jeg.apps.googleusercontent.com',
  //   redirectUri: window.location.origin
  // });


  $routeProvider
    .when('/', {
      templateUrl: 'partials/login.html',
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
    })
    .when('/register', {
      templateUrl: 'partials/signup.html'
    })
    .otherwise('/');

}]);

// app.run(function ($rootScope, $location, $route, $auth) {
//   $rootScope.$on('$routeChangeStart', function (event, next, current) {
//     if (next.access.restricted && !$auth.isAuthenticated()) {
//       $location.path('/login');
//       $route.reload();
//     }
//   });
// });

//examples:
    // .when('/writing/:id', {
    //   templateUrl: 'partials/singleWriting.html',
    //   access: {restricted: true}
    // })
    // .when('/sample-dash', {
    //   templateUrl: 'partials/sampleDashboard.html',
    //   access: {restricted: false}
    // })


