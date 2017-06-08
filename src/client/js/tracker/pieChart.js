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
          colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
        }
        return colors;
      }());

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
                format: '{point.name}: {point.y:.1f}%'
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

      }

      // //the opts must be initiated first
      $timeout(function(){
        vm.chart = Highcharts.chart(element[0], vm.chartOptions);
      }, 1000);

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
          $log.debug('updating pie data');
          if(vm.chart){
            vm.chart.update({
              series: [{
                name: 'Expenses',
                colorByPoint: true,
                data: newVal.series
              }],
              drilldown:{
                series: newVal.drilldown
              }
            })
          }
        }
      });

      vm.$watch('opts', function (newVal, oldVal) {

        if(oldVal != newVal){
          $log.debug('updating pie data');
          var label = "{name} - ${y}";
          if(vm.chart){
            if(newVal == 'pie'){
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

    }
  };
}]);

