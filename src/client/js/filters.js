app.filter('shortDate', [
  function() {
    return function(date) {
      if (date) {
        return date.slice(0, 5);
      }
      return;
    };
  }
]).filter('transactionRange', [
  function(){
    return function(transactions, range, start, end) {
      if(range && range != null){
        if(range === 'other'){
          //make sure the range start and end dates are right
          if(!start || !end){
            return transactions;
          }
          else {
            var rangeStart = moment(start).format('YYYY-MM-DD');
            var rangeEnd = moment(end).format('YYYY-MM-DD');
            transactions = transactions.filter(function(t){
              var date = moment(t.date, 'MM-DD-YYYY').format('YYYY-MM-DD');
              if(moment(date).isSameOrAfter(rangeStart) && moment(date).isSameOrBefore(rangeEnd)){
                return t;
              }
            });
            return transactions;
          }

        }
        var rangeStart = moment().subtract(range, 'd').format('YYYY-MM-DD');
        transactions = transactions.filter(function(t){
          var date = moment(t.date, 'MM-DD-YYYY').format('YYYY-MM-DD');
          if(moment(date).isAfter(rangeStart)){
            return t;
          }
        });
      }
      return transactions;
    };

  }
]);
