(function() {
  // 'use strict';
  // angular.module('com.expensetracker.services.api', [])

  app.factory('expenseApi', ['$http', '$q', '$log', function($http, $q, $log){
    var expenseApi = {

      user: {

        get: function(params){
          return $http.get('/userAPI/userById/' + params, params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("user: get", err);
          });
        },

        update: function(params, id){
          return $http.put('/userAPI/user/' + id, params).then(function(response){
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
          return $http.post('categoryAPI/category', params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("categories: add", err);
          });
        },

        update: function(params){
          return $http.put('categoryAPI/category/' + params.id, params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("category: update", err);
          });
        }

      },

      transactions: {

        getAll: function(params){
          // params is the username
          return $http.get('transactionAPI/' + params).then(function(response){
            return response.data;
          }).catch(function(err){
            $log.error("transactions: getAll", err);
          });
        },

        add: function(params){
          return $http.post('transactionAPI/transaction', params).then(function(response){
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
