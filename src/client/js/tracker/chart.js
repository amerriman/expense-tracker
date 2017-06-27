app.directive('hcChart', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      title: '@',
      data: '=chartdata',
      opts: '=chartopts'
    },
    transclude: true,
    link: function (vm, element, attrs, modelCtrl) {

      // Make monochrome colors and set them as default for all pies - temporary
      Highcharts.getOptions().plotOptions.pie.colors = (function () {
        var colors = [],
          base = Highcharts.getOptions().colors[0],
          i;
        for (i = 0; i < 15; i += 1) {
          // Start out with a darkened base color (negative brighten), and end
          // up with a much brighter color
          colors.push(Highcharts.Color(base).brighten((i - 2) / 5).get());
        }
        return colors;
      }());

      //basic options for all the charts
      vm.chartOptions = {
        chart: {
          type: vm.opts
        },
        xAxis: {
          type: 'category'
        },
        title: {
          text: vm.title
        },
        subtitle: {
          text: 'Click a category to view user specific info'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            series: {
              dataLabels: {
                enabled: true,
                format: '{point.name}: ${point.y:.1f}%'
              }
            }
          }
        },
        legend: {
          labelFormat: "{name} - ${y}"
        },
        series: [{
          name: 'Expenses',
          colorByPoint: true,
          data: vm.data.series
        }],
        drilldown:{
          series: vm.data.drilldown
        }
      };


      // //the opts must be initiated first - find a better way to deal with this and add a spinner
      $timeout(function(){
        vm.chart = Highcharts.chart(element[0], vm.chartOptions);
      }, 1500);


      // Watchers
      vm.$watch('title', function (oldVal, newVal) {
        if(oldVal != newVal){
          $log.debug('updating pie title');
          if(vm.chart){
            vm.chart.update({
              title:{
                text: vm.title
              }
            })
          }
        }
      });

      vm.$watch('data', function (newVal, oldVal) {

        if(oldVal != newVal){
          $log.debug('updating chart data');
          if(vm.chart){
            //update drilldown manually, doesn't work in the update function
            vm.chart.options.drilldown.series = newVal.drilldown;
            vm.chart.update({
              series: [{
                name: 'Expenses',
                colorByPoint: true,
                data: newVal.series
              }]
            });
          }
        }
      });

      vm.$watch('opts', function (newVal, oldVal) {
        if(oldVal != newVal){
          $log.debug('updating chart data');
          var label = "{name} - ${y}";
          if(vm.chart){
            if(newVal == 'column'){
              label = "{name} {y}"
            }
            vm.chart.update({
              chart: {
                type: vm.opts
              },
              legend: {
                labelFormat: label
              }
            });
          }
        }
      });

    // End Watchers

    }
  };
}]);

