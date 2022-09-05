<template>
  <div>
    <!-- 表单 -->
    <el-form
      :inline="true"
      :model="cForm"
      class="demo-form-inline"
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <el-form-item label="一级分类" style="margin: 0 0 0 10px">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          :disabled="isShow"
          @change="handler1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="margin-bottom: 0">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          :disabled="isShow"
          @change="handler2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" style="margin-bottom: 0">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          :disabled="isShow"
          @change="handler3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["isShow"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    // 获取数据
    async getCategory1List() {
      const result = await this.$API.reqGetCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类
    async handler1() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      const result = await this.$API.reqGetCategory2List(
        this.cForm.category1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      const result = await this.$API.reqGetCategory3List(
        this.cForm.category2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类
    async handler3() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style scoped>
</style>