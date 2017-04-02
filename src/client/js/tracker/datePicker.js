app.directive('datepicker', ["$log", "$timeout", function($log, $timeout) {
    return {
        restrict: 'E',
        require : 'ngModel',
        templateUrl: '../../templates/datepicker.html',
        link: function(vm, element, attrs, ngModelCtrl) {
          //element must have an ng-model
          console.log(element, "element")

            // $('#date-picker').datepicker({
            //   format: "mm/dd/yyyy",
            //   todayBtn: "linked",
            //   todayHighlight: true,
            //   autoclose: true
            // }).on('changeDate', function(e) {
            //   ngModelCtrl.$setViewValue(e.date);
            //   vm.$apply();
            // });

        }
    };
}]);

