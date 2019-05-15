<template>
  <div id="trend" style="height:230px"></div>
</template>

<script>
import Highcharts from "highcharts";
import { setOptionsLine } from "./help";
export default {
  name: "trend",
  props: {
    color: {
      type: String,
      default: "#2d8cf0"
    },
    name: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    total: {
      tye: String,
      require: true
    }
  },
  data: () => ({
    chart: null
  }),
  watch: {
    data: {
      handler: "update",
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { color, name, data, total } = this;

      this.chart = Highcharts.chart(
        "trend",
        setOptionsLine({ color, name, data, total })
      );
    },
    update() {
      const { name, data, color, total } = this;
      console.log(this);
      this.chart.update({
        series: [{ name, data, color, total }]
      });
    }
  }
};
</script>
