// angular.module('com.expensetracker.directives.datepicker', [])
app.directive('datepicker', ["$log", "$timeout", function($log, $timeout) {
    return {
        restrict: 'AE',
        require : '?ngModel',
        link: function(vm, element, attrs, ngModelCtrl) {
          //element must have an id and an ng-model
          //grab the id of the elements and append the picker to that
          $timeout(function(){
            // var id = '#' + element[0].id;
            var id = element[0].id;


            $('#date-picker').datepicker({
              format: "mm/dd/yyyy",
              todayBtn: "linked",
              todayHighlight: true,
              autoclose: true
            }).on('changeDate', function(e) {
              ngModelCtrl.$setViewValue(e.date);
              vm.$apply();
            });
          });


        }
    };
}]);

