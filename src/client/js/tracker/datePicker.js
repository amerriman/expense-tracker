// angular.module('com.expensetracker.directives.datepicker', [])
app.directive('datepicker', ["$log", "$timeout", function($log, $timeout) {
    return {
        restrict: 'AE',
        require : 'ngModel',
        templateUrl: '../../templates/datepicker.html',
        link: function(vm, element, attrs, ngModelCtrl) {
          //element must have an ng-model

            $('#date-picker').datepicker({
              format: "mm/dd/yyyy",
              todayBtn: "linked",
              todayHighlight: true,
              autoclose: true
            }).on('changeDate', function(e) {
              ngModelCtrl.$setViewValue(e.date);
              vm.$apply();
            });

        }
    };
}]);

