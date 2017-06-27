app.service('chartDataService', ["$log", '$timeout', "expenseApi", function ($log, $timeout, expenseApi) {
  var chartDataService = {
    pieData: function(catArr, expArr, users, income, zeros){
      var obj = {};
      //set up object with categories and users for the drilldown
      catArr.map(function(cat){
        var catName = cat.category_name;
        if(income === false){
          if(cat.type !== 'income'){
            obj[catName] = {
              amount: 0,
              unspecified: 0
            };
            users.forEach(function(u){
              obj[catName][u] = 0
            });
            return obj[catName];
          }
        } else {
          obj[catName] = {
            amount: 0,
            unspecified: 0
          };
          users.forEach(function(u){
            obj[catName][u] = 0
          });
          return obj[catName];
        }
      });
      //add up all the amounts
      expArr.map(function(ex){
        var cat = ex.category;
        var amt = parseFloat(ex.amount);
        var user = ex.user_indiv;
        //add amounts, cast to number and fix at 2 decimals
        if(obj[cat] != null){
          obj[cat].amount = +(amt + obj[cat].amount).toFixed(2);
          if(user != null){
            obj[cat][user] = +(obj[cat][user] + amt).toFixed(2);
          } else {
            obj[cat].unspecified = +(obj[cat].unspecified + amt).toFixed(2);
          }
        } else {
          $log.debug("category does not exist")
        }
      });
      //format into array of objects Highcharts expects
      var dataArray = [];
      var dataDrilldown = [];
      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
          var dataObj = {name: key, y: obj[key].amount, drilldown: key};
          if(zeros == false){
            if(dataObj.y !== 0){
              dataArray.push(dataObj);
            }
          } else {
            dataArray.push(dataObj);
          }
          var drilldownObj = {name: key, id: key, data: []};
          var newObj = obj[key];
          for(var newKey in newObj){
            var keyData = [];
            if(newObj.hasOwnProperty(newKey)){
              if(newKey != 'amount'){
                keyData.push(newKey);
                keyData.push(newObj[newKey]);
                drilldownObj.data.push(keyData)
              }
            }
          }
          dataDrilldown.push(drilldownObj)
        }
      }
      //should sort these based on amount so darkest pie color is highest amount
      dataArray.sort(function (a, b) {
        return b.y - a.y
      });
      var pieOpts = {
        series: dataArray,
        drilldown: dataDrilldown
      };
      return pieOpts
    }

  };

  return chartDataService;
}]);