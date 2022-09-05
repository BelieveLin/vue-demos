<template>
  <div>
    <!-- Layout 布局 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <Detail title="总销售额" :count="`¥${info.salesTotal}`">
          <template #charts>
            <span>
              周同比 {{ info.salesGrowthLastWeek }}%
              <i class="el-icon-caret-top" style="color: red"></i>
            </span>
            <span>
              日同比 {{ info.salesGrowthLastDay }}%
              <i class="el-icon-caret-bottom" style="color: yellowgreen"></i>
            </span>
          </template>
          <template #footer>
            <span>日销售额 ¥{{ info.salesToday }}</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" :count="info.visitTotal">
          <template #charts>
            <CardLineChart :visitTrend="info.visitTrend"></CardLineChart>
          </template>
          <template #footer>
            <span>日访问量 {{ info.visitToday }}</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数" :count="info.payTotal">
          <template #charts>
            <CardBarChart :payTrend="info.payTrend"></CardBarChart>
          </template>
          <template #footer>
            <span>转化率 {{ info.payRate }}%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果" :count="`${info.activityRate}%`">
          <template #charts>
            <ProgressChart :activityRate="info.activityRate"></ProgressChart>
          </template>
          <template #footer>
            <span>
              周同比 {{ info.activityGrowthLastWeek }}%
              <i class="el-icon-caret-top" style="color: red"></i>
            </span>
            <span>
              日同比 {{ info.activityGrowthLastDay }}%
              <i class="el-icon-caret-bottom" style="color: yellowgreen"></i>
            </span>
          </template>
        </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./detail";
import CardLineChart from "./cardLineChart";
import CardBarChart from "./cardBarChart";
import ProgressChart from "./progressChart";
import { mapState } from "vuex";

export default {
  name: "Card",
  computed: {
    ...mapState("home", ["info"]),
  },
  components: {
    Detail,
    CardLineChart,
    CardBarChart,
    ProgressChart,
  },
};
</script>

<style scoped>
</style>