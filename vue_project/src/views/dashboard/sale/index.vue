<template>
  <div class="sale">
    <!-- 卡片 -->
    <el-card class="box-card" style="margin-top: 10px">
      <div slot="header" class="header">
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <!-- Layout 布局 -->
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="charts" ref="saleBarChart"></div>
          </el-col>
          <el-col :span="8">
            <h3 style="margin-top: 0">门店{{ title }}排名</h3>
            <ul>
              <li
                v-for="order in info.orderRank"
                :key="order.money"
                v-show="activeName == 'sale'"
              >
                <span :class="{ active: order.no <= 3 }">{{ order.no }}</span>
                <span>{{ order.name }}</span>
                <span>{{ order.money }}</span>
              </li>
              <li
                v-for="user in info.userRank"
                :key="user.money"
                v-show="activeName == 'visit'"
              >
                <span :class="{ active: user.no <= 3 }">{{ user.no }}</span>
                <span>{{ user.name }}</span>
                <span>{{ user.money }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      // 标签页选中名称
      activeName: "sale",
      // 日历日期
      date: [],
      // 柱状图
      saleBarChart: "",
    };
  },
  computed: {
    ...mapState("home", ["info"]),
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  methods: {
    // 改变标签页
    handleClick() {
      this.saleBarChart.setOption({
        title: {
          text: `${this.title}趋势图`,
        },
        xAxis: {
          data:
            this.activeName == "sale"
              ? this.info.orderFullYearAxis
              : this.info.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.activeName == "sale"
                ? this.info.orderFullYear
                : this.info.userFullYear,
          },
        ],
      });
    },
    // 今日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const week1 = dayjs().day(0).format("YYYY-MM-DD");
      const week2 = dayjs().day(6).format("YYYY-MM-DD");
      this.date = [week1, week2];
    },
    // 本月
    setMonth() {
      const month1 = dayjs().startOf("month").format("YYYY-MM-DD");
      const month2 = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [month1, month2];
    },
    // 本年
    setYear() {
      const year1 = dayjs().startOf("year").format("YYYY-MM-DD");
      const year2 = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [year1, year2];
    },
  },
  mounted() {
    this.saleBarChart = this.$ECharts.init(this.$refs.saleBarChart);
    this.saleBarChart.setOption({
      title: {
        text: `${this.title}趋势图`,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.info.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.info.orderFullYear,
        },
      ],
    });
  },
};
</script>

<style>
.sale .box-card .el-card__header {
  border-bottom: none;
}

.sale .box-card .el-tabs {
  width: 100%;
}

.sale .box-card .header {
  display: flex;
  position: relative;
  justify-content: space-between;
}

.sale .right {
  position: absolute;
  right: 0;
}

.sale .right span {
  margin-right: 10px;
}

.sale .right span:last-of-type {
  margin-right: 20px;
}

.sale .charts {
  width: 100%;
  height: 265px;
}

.sale ul {
  padding: 0;
  width: 100%;
  height: 265px;
  list-style: none;
}
.sale li {
  margin-bottom: 20px;
}

.sale li span:first-of-type {
  float: left;
  width: 25px;
  height: 25px;
  margin: -3px 10px 0 0;
  text-align: center;
  line-height: 25px;
}

.sale li span:nth-of-type(2) {
  margin-top: -50px;
}

.sale li span:last-of-type {
  float: right;
}

.sale .active {
  border-radius: 50%;
  background-color: black;
  color: white;
}
</style>