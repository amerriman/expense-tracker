angular.module('myApp', [
  'ngRoute',
  'satellizer',
  'com.expensetracker.directives.login',
  'com.expensetracker.directives.signup'
  ])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {

  // *** satellizer settings ***
  $authProvider.google({
    url: '/auth/google',
    clientId: GOOGLE_CLIENTID,
    redirectUri: window.location.origin
  });


  $routeProvider
    .when('/', {
      templateUrl: 'partials/login.html',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'partials/signup.html',
      access: {restricted: false}
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


