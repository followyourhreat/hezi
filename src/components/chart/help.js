import Highcharts from 'highcharts';

export const credits = {
  enabled: false,
  href: 'http://www.dtston.com',
  text: 'dtston.com'
};

export const setOptionsLine = oKeys => {
  const { color, name, data, total } = oKeys;
  return {
    chart: {
      backgroundColor: '#171721',
      type: 'area',
      zoomType: 'x'
        // alignTicks: false
    },
    credits,
    title: {
      text: null
    },
    // subtitle: {
    //   text: document.ontouchstart === undefined ? '鼠标拖动可以进行缩放' : '手势操作进行缩放'
    // },
    xAxis: {
      type: 'category',
      lineColor: '#22212F',
      tickColor: '#22212F'
        // crosshair: true,
        // minorTickInterval: 'auto',
        // // endOnTick: true,
        // dateTimeLabelFormats: {
        //   // millisecond: '%H:%M:%S.%L',
        //   // second: '%H:%M:%S',
        //   // minute: '%H:%M',
        //   // hour: '%H:%M',
        //   day: '%m-%d',
        //   week: '%m-%d',
        //   month: '%Y-%m',
        //   year: '%Y'
        // }
    },
    yAxis: {
      title: {
        text: null
      },
      // min: 0,
      // allowDecimals: false,
      // crosshair: true,
      gridLineColor: '#22212F',
      gridLineDashStyle: 'longdash',
    },
    // tooltip: {
    //   dateTimeLabelFormats: {
    //     // millisecond: '%H:%M:%S.%L',
    //     // second: '%H:%M:%S',
    //     // minute: '%H:%M',
    //     // hour: '%H:%M',
    //     day: '%Y-%m-%d',
    //     week: '%m-%d',
    //     month: '%Y-%m',
    //     year: '%Y'
    //   }
    // },
    tooltip: {
      crosshairs: true,
      crosshairs: [{ // 设置垂直准星线样式
        width: 1,
        color: '#ff0000'
      }],
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, '#ff0000'],
          [1, '#ff0000']
        ]
      },
      borderRadius: 6,
      borderColor: '#ff0000',
      style: { // 文字内容相关样式
        color: "#fff",
        fontSize: "12px",
        lineHeight: "24px"
      },
      // pointFormat: '{series.name}: {point.y}<br/>总用户:{total}',
      formatter: function() {
        let dt = this.key;
        let date = dt.substring(0, 19);
        let dates = date.replace(/-/g, '/');
        let timestamp = new Date(dates);
        let year = timestamp.getFullYear();
        let month = timestamp.getMonth() + 1;
        let date2 = timestamp.getDate();
        let day = timestamp.getDay();
        let weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let dt2 = year + "/" + month + "/" + date2 + " " + weekDay[day];
        //字符串转为时间戳  再渲染为时间
        return dt2 + "<br/>" + "● " + this.series.name + ":" + this.point.y +
          '<br/> ● 总用户:' + oKeys.total + '</br>';
      },
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.Color(color).setOpacity(0.5).get('rgba')],
            [1, Highcharts.Color(color).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          enabled: false,
          radius: 4,
          fillColor: '#0a0b11',
          lineWidth: 1,
          lineColor: '#ff0000'
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    series: [{
      name,
      data,
      color,
      total
    }]
  }
};
