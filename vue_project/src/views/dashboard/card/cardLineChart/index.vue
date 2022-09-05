<template>
  <div class="charts" ref="cardLineChart"></div>
</template>

<script>
export default {
  name: "CardLineChart",
  props: ["visitTrend"],
  mounted() {
    let cardLineChart = this.$ECharts.init(this.$refs.cardLineChart);
    cardLineChart.setOption({
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
          type: "line",
          data: this.visitTrend,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: "purple",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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