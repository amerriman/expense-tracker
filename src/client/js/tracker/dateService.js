app.service('dateService', ["$log", '$timeout', "expenseApi", function ($log, $timeout, expenseApi) {
  var dateService = {
    customRange: function(start, end, id){
        var params = {
            start: moment(start).format('L').replace(/[/]/g, '-'),
            end: moment(end).format('L').replace(/[/]/g, '-'),
            id: id
        };
        return expenseApi.transactions.getRange(params);
    }

  };

  return dateService;
}]);
