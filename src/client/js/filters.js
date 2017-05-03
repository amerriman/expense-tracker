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
    return function(transactions, range ) {
      if(range && range != null){
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
