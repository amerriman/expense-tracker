app.service('chartDataService', ["$log", '$timeout', "expenseApi", function ($log, $timeout, expenseApi) {
  var chartDataService = {
    pieData: function(catArr, expArr){
      var obj = {};
      //set up object with categories
      catArr.map(function(cat){
        return obj[cat] = 0
      });
      //add up all the amounts
      expArr.map(function(ex){
        var cat = ex.category;
        var amount = parseInt(ex.amount);
        if(obj[cat] != null){
          return obj[cat] = amount + obj[cat]
        } else {
          $log.debug("category does not exist")
        }
      });
      //format into array of objects Highcharts expects
      var dataArray = [];
      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
          var dataObj = {name: key, y: obj[key]};
          dataArray.push(dataObj)
        }
      }
      //should sort these based on amount so darkest pie color is highest amount
      dataArray.sort(function (a, b) {
        return b.y - a.y
      });
      return dataArray
    }

  };

  return chartDataService;
}]);