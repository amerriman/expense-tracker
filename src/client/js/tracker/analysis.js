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
      vm.selectMonths = [];
      vm.selectYears = [];
      vm.includeIncome = false;
      vm.includeZeros = false;
      vm.isAnalyzing = true;

      function messageTimeout(){
        vm.error = false;
      }

      function getMonths(){
        var thisMonth = moment();
        var dateStart = moment('2017-01', 'YYYY-MM');

        while (dateStart.isBefore(thisMonth)) {
          var month;
          month = moment(dateStart).format('MMMM YYYY');
          vm.selectMonths.unshift(month);
          dateStart.add(1,'month');
        }
      }
      
      function getYears(){
        var thisYear = moment();
        var yearStart = moment('2017', 'YYYY');
        while (yearStart.isSameOrBefore(thisYear)) {
          var year;
          year = moment(yearStart).format('YYYY');
          vm.selectYears.unshift(year);
          yearStart.add(1,'year');
        }
      }

      vm.chooseTimePeriod = function(selected){
        vm.title = selected;
        getExpenses(selected);
      };


      function getExpenses(selected){
        var params = {
          id: vm.currentUser.username
        };
        //if selecting month
        if(vm.analyzeRange == 'month'){
          params.start = moment(selected, "MMMM YYYY").startOf('month').format('L').replace(/[/]/g, '-');
          params.end = moment(selected, "MMMM YYYY").endOf('month').format('L').replace(/[/]/g, '-');
        } else {
          params.start = moment(selected, "YYYY").startOf('year').format('L').replace(/[/]/g, '-');
          params.end = moment(selected, "YYYY").endOf('year').format('L').replace(/[/]/g, '-');
        }

        expenseApi.transactions.getRange(params).then(function(resp){
          vm.expenseArray = resp;
          formatTransactions(vm.expenseArray);

          //send the array and the category stuff away to be figured out
          expenseApi.categories.getAll(params.id).then(function(resp){
            vm.categoryArray = resp;
            vm.chartData = chartDataService.pieData(vm.categoryArray, vm.expenseArray, vm.users, vm.includeIncome, vm.includeZeros);
          })
        })
      }

      function formatTransactions(expenseArr){
        expenseArr.forEach(function(transaction){
          transaction.date = moment.utc(transaction.date).format('L');
        });
        vm.displayTransactions = expenseArr;
      }

      vm.setTime = function(time){
        if(time){
          vm.analyzeRange = time;
          if(time == 'month'){
            getExpenses(vm.selectedMonth);
            vm.title = vm.selectedMonth;
          } else {
            getExpenses(vm.selectedYear);
            vm.title = vm.selectedYear;
          }
        }
      };

      vm.setIncome = function(income){
        if(!income){
          vm.includeIncome = false;
        } else {
          vm.includeIncome = income;
        }
        vm.chartData = chartDataService.pieData(vm.categoryArray, vm.expenseArray, vm.users, vm.includeIncome, vm.includeZeros)
      };

      vm.setZeros = function(zeros){
        if(!zeros){
          vm.includeZeros = false;
        } else {
          vm.includeZeros = zeros;
        }
        vm.chartData = chartDataService.pieData(vm.categoryArray, vm.expenseArray, vm.users, vm.includeIncome, vm.includeZeros)
      };

      vm.setChartType = function(type){
        if(!type){
          return
        }
        vm.chartOpts = type;
      };

      function analysisInit(){
        $log.debug("analyze home");
        vm.selectedMonth = moment().format('MMMM YYYY');
        vm.selectedYear = moment().format('YYYY');
        vm.title = moment().format('MMMM') + " " + moment().format('Y');
        getMonths();
        getYears();
        getExpenses(vm.selectedMonth);
      }

      analysisInit();

    }]
  };
}]);
