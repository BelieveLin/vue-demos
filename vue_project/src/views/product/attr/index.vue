<template>
  <div>
    <!-- 卡片 -->
    <el-card style="margin-bottom: 20px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="!isShowTable"
      ></CategorySelect>
    </el-card>
    <!-- 卡片 -->
    <el-card>
      <!-- 展示 -->
      <div v-if="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table
          :data="attrList"
          style="width: 100%"
          v-loading="listLoading"
          border
          stripe
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                :disable-transitions="true"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 12px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}吗?`"
                style="margin-left: 10px"
                @onConfirm="delAttr(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改 -->
      <div v-else>
        <!-- 表单 -->
        <el-form :inline="true" :model="attrInfo" label-width="80px">
          <el-form-item label="属性名" style="margin-left: -25px">
            <el-input
              v-model.trim="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
          stripe
        >
          <!-- 表格 -->
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width" key="attrValueName">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.inputVisible"
                v-model.trim="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                :ref="$index"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <div v-else @click="toUpdate(row, $index)" height="28">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="delAttrValue($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addorUpdateAttrInfo"
          :disabled="!attrInfo.attrValueList.length"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 加载效果
      listLoading: false,
      // 表格的显示与隐藏，按钮的启用与禁用
      isShowTable: true,
      // 表格数据
      attrList: [],
      // 属性信息
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 三级分类
    getCategoryId(category) {
      if (category.level == 1) {
        this.category1Id = category.categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (category.level == 2) {
        this.category2Id = category.categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = category.categoryId;
        this.getAttrList();
      }
    },
    // 获取数据
    async getAttrList() {
      this.listLoading = true;
      const result = await this.$API.reqGetAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
        this.listLoading = false;
      }
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      // 添加响应式属性
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "inputVisible", false);
      });
    },
    // 添加属性
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 删除属性
    async delAttr(row) {
      const result = await this.$API.reqDelAttr(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        if (this.attrList.length <= 1 && this.pageNum > 1) this.pageNum--;
        this.getAttrList();
      } else this.$message.error("删除失败");
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        inputVisible: true,
      });
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 删除属性值
    delAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 取消
    cancel() {
      this.isShowTable = true;
      this.$refs = {};
    },
    // 确认添加或修改
    async addorUpdateAttrInfo() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.inputVisible;
            return true;
          }
        }
      );
      if (this.attrInfo.attrValueList.length) {
        try {
          const result = await this.$API.reqAddorUpdateAttrInfo(this.attrInfo);
          if (result.code == 200) {
            this.$message.success(`${this.attrInfo.id ? "修改" : "添加"}成功`);
            this.getAttrList();
          } else
            this.$message.error(`${this.attrInfo.id ? "修改" : "添加"}失败`);
        } catch (err) {
          this.$message.info(`已取消${this.attrInfo.id ? "修改" : "添加"}`);
        } finally {
          this.isShowTable = true;
        }
      } else this.$message.warning("提交内容不能为空");
    },
    // 查看模式（失焦）
    toLook(row) {
      if (row.valueName == "") {
        this.$message.warning("属性值不能为空");
        return;
      }
      let isRep = this.attrInfo.attrValueList.some((item) => {
        if (item !== row) return item.valueName == row.valueName;
      });
      if (isRep) {
        this.$message.warning("属性值不能重复");
        return;
      }
      row.inputVisible = false;
    },
    // 修改模式（聚焦）
    toUpdate(row, index) {
      row.inputVisible = true;
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
  },
};
</script>

<style scoped>
</style>