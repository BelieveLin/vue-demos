<template>
  <div class="charts" ref="cardBarChart"></div>
</template>

<script>
export default {
  name: "CardBarChart",
  props:["payTrend"],
  mounted() {
    let cardBarChart = this.$ECharts.init(this.$refs.cardBarChart);
    cardBarChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      grid: {
        left: 0,
        top: 5,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          type: "bar",
          data: this.payTrend,
        },
      ],
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>