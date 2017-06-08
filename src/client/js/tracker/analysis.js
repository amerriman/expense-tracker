// angular.module('com.expensetracker.directives.analize', [])
app.directive('analysis', ["$window", "$timeout", "$location", "$log", "expenseApi", "chartDataService", "$q", function ($window, $timeout, $location, $log, expenseApi, chartDataService, $q) {
  return {
    restrict: 'E',
    templateUrl: '../../templates/analysis.html',
    scope: true,
    controller: ["$scope", "$timeout", "$log", "expenseApi", function ($scope, $timeout, $log, expenseApi) {
      var vm = $scope;
      vm.error = false;
      vm.message = "";
      vm.analyzeRange = 'month';
      vm.chartOpts = "pie";


      function messageTimeout(){
        vm.error = false;
      }
      
      function categoryData(){
        var catArray = [];
        if(!vm.categories){
          //maybe log that there are no categories, so nothing can be done...
          return
        } if(vm.categories.length == 0){
          $timeout(function(){
            vm.categories.forEach(function(cat){
              catArray.push(cat.category_name)
            });
            return catArray;
          })
        } else {
          vm.categories.forEach(function(cat){
            catArray.push(cat.category_name)
          });
          return catArray;
        }
        return catArray;
      }

      function getExpenses(){
        
        var params = {
          id: vm.currentUser.username,
          start: moment().startOf('month').format('L').replace(/[/]/g, '-'),
          end: moment().endOf('month').format('L').replace(/[/]/g, '-')
        };

        expenseApi.transactions.getRange(params).then(function(resp){
          vm.expenseArray = resp;
          //send the array and the category stuff away to be figured out
          vm.chartData = chartDataService.pieData(vm.categoryArray, vm.expenseArray, vm.users)
        })
      }


      vm.setTime = function(time){
        if(time){
          vm.analyzeRange = time;
          if(time == 'month'){
            vm.title = moment().format('MMMM') + " " + moment().format('Y');
          } else {
            vm.title = moment().format('Y');
          }
        }
      };
      
      vm.setChartType = function(type){
        if(!type){
          return
        }
        vm.chartOpts = type;
      };

      function init(){
        $log.debug("analize home");
        vm.title = moment().format('MMMM') + " " + moment().format('Y');
        //these do not always work right because the main stuff isn't always set up.  Maybe we need an awaiter...and when that is done, then we move forward. BLARG

        vm.categoryArray = categoryData();
        vm.expenseArray;
        getExpenses();
      }

      init();

    }]
  };
}]);
