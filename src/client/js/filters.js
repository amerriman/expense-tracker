app.filter('shortDate', [
  function() {
    return function(date) {
      if (date) {
        return date.slice(0, 5);
      }
      return;
    };
  }
]);
