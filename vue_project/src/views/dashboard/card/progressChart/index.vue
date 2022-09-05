<template>
  <div class="charts" ref="cardProgressChart"></div>
</template>

<script>
export default {
  name: "ProgressChart",
  props:["activityRate"],
  mounted() {
    let cardProgressChart = this.$ECharts.init(this.$refs.cardProgressChart);
    cardProgressChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
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
          data: [this.activityRate],
          barWidth: "20",
          color: "yellowgreen",
          showBackground: true,
        },
      ],
      label: {
        show: true,
        position: "right",
        formatter: "|",
      },
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