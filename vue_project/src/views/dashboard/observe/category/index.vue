<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>销售额类别占比</span>
        <!-- 单选框 -->
        <el-radio-group v-model="value" size="mini" @change="handleClick">
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div class="charts" ref="categoryPieChart"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["info"],
  computed: {
    // 线上销售列表
    onlineList() {
      return this.info.saleRank.online.name.reduce((prev, item, index) => {
        prev.push({
          name: item,
          value: this.info.saleRank.online.value[index],
        });
        return prev;
      }, []);
    },
    // 门店销售列表
    shopList() {
      return this.info.saleRank.shop.name.reduce((prev, item, index) => {
        prev.push({
          name: item,
          value: this.info.saleRank.shop.value[index],
        });
        return prev;
      }, []);
    },
  },
  data() {
    return {
      value: "线上",
      // 饼图
      categoryPieChart: "",
    };
  },
  methods: {
    // 改变单选框
    handleClick(value) {
      if (value == "线上") {
        this.categoryPieChart.setOption({
          title: {
            text: this.onlineList[0].name,
            subtext: this.onlineList[0].value,
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              data: this.onlineList,
            },
          ],
        });
      } else {
        this.categoryPieChart.setOption({
          title: {
            text: this.shopList[0].name,
            subtext: this.shopList[0].value,
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              data: this.shopList,
            },
          ],
        });
      }
    },
  },
  mounted() {
    this.categoryPieChart = this.$ECharts.init(this.$refs.categoryPieChart);
    this.categoryPieChart.setOption({
      title: {
        text: this.onlineList[0].name,
        subtext: this.onlineList[0].value,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: this.onlineList,
        },
      ],
    });
    // 给饼图绑定事件
    this.categoryPieChart.on("mouseover", (params) => {
      this.categoryPieChart.setOption({
        title: {
          text: params.data.name,
          subtext: params.data.value,
        },
      });
    });
  },
};
</script>

<style scoped>
.el-card {
  height: 456px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 18px;
}

.charts {
  width: 100%;
  height: 300px;
  margin-top: 30px;
}
</style>