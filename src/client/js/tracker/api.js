(function() {
  'use strict';
  angular.module('com.expensetracker.services.api', [])

  .factory('expenseApi', ['$http', '$q', '$log', function($http, $q, $log){
    var expenseApi = {

      user: {

        get: function(params){
          return $http.get('/userAPI/userById/' + params, params).then(function(response){
            return response.data;
          });
        }

      },

      categories: {

        getAll: function(params){
          return $http.get('categoryAPI/' + params).then(function(response){
            return response.data;
          });
        }

      }


    };

    return expenseApi;




  }]);
})();
