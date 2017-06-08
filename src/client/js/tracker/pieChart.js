app.directive('hcPieChart', ["$timeout", "$log", "expenseApi", function ($timeout, $log, expenseApi) {
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      title: '@',
      opts: '=options'
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

      var pieOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: vm.title
        },
        subtitle: {
          text: 'Click the slices to view user specific info'
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
          data: vm.opts.series

        }],
        drilldown:{
          series: vm.opts.drilldown
        }

      }

      // //the opts must be initiated first
      $timeout(function(){
        var pie = Highcharts.chart(element[0], pieOptions);
      }, 1000);

      vm.$watch('title', function (oldVal, newVal) {

        if(oldVal != newVal){
          $log.debug('updating pie title');
          if(pie){
            pie.update({
              title:{
                text: vm.title
              }
            })
          }
        }
      });

      vm.$watch('opts', function (newVal, oldVal) {

        if(oldVal != newVal){
          $log.debug('updating pie opts');
          if(pie){
            pie.update({
              series: [{
                name: 'Expenses',
                colorByPoint: true,
                data: newVal.series
              }],
              drilldown:{
                series: newVal.drilldown
              }
            })
            console.log(pie, "PIE????")
          }
        }
      });
      
    }
  };
}]);