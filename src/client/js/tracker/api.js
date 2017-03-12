(function() {
  'use strict';
  angular.module('com.expensetracker.services.api', [])

  .factory('expenseApi', ['$http', '$q', '$log', function($http, $q, $log){
    var expenseApi = {

      user: {

        get: function(params){
          return $http.get('/userAPI/userById/' + params, params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("user: get", err);
          });
        }

      },

      categories: {

        getAll: function(params){
          return $http.get('categoryAPI/' + params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("categories: getAll", err);
          });
        },

        add: function(params){
          console.log("HERererererer", params)
          return $http.post('categoryAPI/category', params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("categories: add", err);
          });
        }

      }


    };

    return expenseApi;




  }]);
})();
