<template>
  <div style="margin-top: 10px">
    <!-- Layout 布局 -->
    <el-row :gutter="10">
      <el-col :span="12">
        <Search :info="info"></Search>
      </el-col>
      <el-col :span="12">
        <Category :info="info"></Category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from "./category";
import Search from "./search";
import { mapState } from "vuex";

export default {
  name: "Observe",
  computed: {
    ...mapState("home", ["info"]),
  },
  components: {
    Category,
    Search,
  },
};
</script>

<style scoped>
</style>