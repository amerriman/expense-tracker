// angular.module('com.expensetracker.directives.datepicker', [])
app.directive('datepicker', ["$log", "$timeout", function($log, $timeout) {
    return {
        restrict: 'AE',
        require : '?ngModel',
        templateUrl: '../../templates/datepicker.html',
        link: function(vm, element, attrs, ngModelCtrl) {
          //element must have an id and an ng-model
          //grab the id of the elements and append the picker to that

            var id = '#' + element[0].id;
            // var id = element[0].id;


            $(id).datepicker({
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

