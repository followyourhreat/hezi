<template>
  <div id="container" style="width:520px;height:auto;"></div>
</template>

<script>
// import $ from "jsonp";
import world from "./world";
import Highcharts from "highcharts";
import Highmaps from "highcharts/modules/map";

Highmaps(Highcharts);

export default {
  props: {
    worldList: Array
  },
  data: () => ({
    map: null
  }),
  watch: {
    worldList: {
      handler: "init",
      deep: true
    }
  },
  mounted() {},
  methods: {
    init(data) {
      data = data.map(v => ({ code: v.code, value: v.value, name: v.name }));
      let options = {
        chart: {
          backgroundColor: "#171721"
        },

        title: {
          text: ""
        },
        mapNavigation: {
          enabled: true
        },
        legend: {
          enabled: false,
          title: {
            text: "",
            style: {
              color: "black"
            }
          },
          align: "left",
          verticalAlign: "bottom",
          floating: true,
          layout: "vertical",
          valueDecimals: 0,
          backgroundColor: "rgba(255,255,255,0.85)",
          symbolRadius: 0,
          symbolHeight: 14
        },
        colorAxis: {
          dataClasses: [
            {
              to: 3,
              color: "rgba(255,0,0,0.2)"
            },
            {
              from: 3,
              to: 10,
              color: "rgba(255,0,0,0.2)"
            },
            {
              from: 10,
              to: 30,
              color: "rgba(255,0,0,0.3)"
            },
            {
              from: 30,
              to: 100,
              color: "rgba(255,0,0,0.4)"
            },
            {
              from: 100,
              to: 300,
              color: "rgba(255,0,0,0.6)"
            },
            {
              from: 300,
              to: 1000,
              color: "rgba(255,0,0,0.8)"
            },
            {
              from: 1000,
              color: "rgba(255,0,0,1)"
            }
          ]
        },
        series: [
          {
            data: data,
            mapData: world,
            joinBy: ["iso-a2", "code"],
            animation: true,
            name: "Population density",
            states: {
              hover: {
                color: "#0887ff"
              }
            },
            tooltip: {
              valuePrefix: "¥"
              // valueSuffix: "/km²"
            }
          }
        ]
      };
      Highcharts.Map("container", options);
      // Highcharts.chart("container", this.options);
    }
  }
};
</script>
<style>
</style>
