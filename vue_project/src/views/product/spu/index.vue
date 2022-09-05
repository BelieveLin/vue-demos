<template>
  <div>
    <!-- 卡片 -->
    <el-card style="margin-bottom: 20px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="scene != 0"
      ></CategorySelect>
    </el-card>
    <!-- 卡片 -->
    <el-card>
      <!-- 展示SPU -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table
          :data="spuList"
          style="width: 100%; margin: 20px 0"
          v-loading="listLoading"
          border
          stripe
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前SPU的SKU列表"
                @click="checkSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗?`"
                style="margin-left: 10px"
                @onConfirm="delSpu(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                  title="删除SPU"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="totalCount"
          style="text-align: center"
        >
        </el-pagination>
      </div>
      <!-- 添加或修改SPU -->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <!-- 添加SKU -->
      <SkuForm
        v-show="scene == 2"
        @changeScene="changeScene"
        ref="sku"
      ></SkuForm>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="`${spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      @close="close"
    >
      <el-table :data="skuList" v-loading="loading" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" width="100" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./spuForm";
import SkuForm from "./skuForm";

export default {
  name: "Spu",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      // 加载效果
      listLoading: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 场景切换
      scene: 0, // 0：展示SPU，1：添加或修改SPU，2：添加SKU
      // 表格数据
      spuList: [],
      // 对话框数据
      skuList: [],
      // 对话框标题
      spuName: "",
      // 对话框的显示与隐藏
      dialogTableVisible: false,
      // 加载效果
      loading: true,
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
        this.getSpuList();
      }
    },
    // 获取数据
    async getSpuList() {
      this.listLoading = true;
      const result = await this.$API.reqGetSpuList(
        this.pageNum,
        this.pageSize,
        { category3Id: this.category3Id }
      );
      if (result.code == 200) {
        this.totalCount = result.data.total;
        this.spuList = result.data.records;
        this.listLoading = false;
      }
    },
    // 切换场景
    changeScene(position) {
      this.scene = position.scene;
      if (position.flag == "添加SPU") this.pageNum = 1;
      if (position.flag != "添加SPU") this.getSpuList();
    },
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getSpuList();
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSpuList();
    },
    // 添加SPU
    addSpu() {
      this.scene = 1;
      this.$refs.spu.getAddData(this.category3Id);
    },
    // 修改SPU
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.getUpdateData(row);
    },
    // 删除SPU
    async delSpu(row) {
      const result = await this.$API.reqDelSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        if (this.spuList.length <= 1 && this.pageNum > 1) this.pageNum--;
        this.getSpuList();
      } else this.$message.error("删除失败");
    },
    // 添加SKU
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getAddData(this.category1Id, this.category2Id, row);
    },
    // 查看SKU
    async checkSku(row) {
      this.spuName = row.spuName;
      const result = await this.$API.reqGetSkuList(row.id);
      if (result.code == 200) {
        this.loading = false;
        this.skuList = result.data;
        this.dialogTableVisible = true;
      }
    },
    //关闭SKU
    close() {
      this.spuName = "";
      this.skuList = [];
      this.loading = true;
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style scoped>
</style>