<template>
  <div>
    <div class="line-header">
      <span> {{ title }} </span>
    </div>
    <div class="line-main">
      <slot name="main"></slot>
    </div>
    <div class="line-footer">
      <div class="charts" ref="searchLineChart"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchLineChart",
  props: ["title"],
  mounted() {
    let searchLineChart = this.$ECharts.init(this.$refs.searchLineChart);
    searchLineChart.setOption({
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
          data: [5, 12, 3, 9, 4, 8],
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: "skyblue",
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
                  color: "skyblue", // 0% 处的颜色
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
.line-header {
  display: flex;
  align-items: center;
}

.line-header span {
  margin-right: 10px;
  color: gray;
}

.line-main {
  margin-top: 5px;
}

.line-main span:first-of-type {
  margin-right: 15px;
  font-size: 25px;
}

.line-main span:last-of-type {
  font-size: 14px;
}

.charts {
  width: 100%;
  height: 50px;
}
</style>