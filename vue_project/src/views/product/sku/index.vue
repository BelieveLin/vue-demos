<template>
  <div class="sku">
    <!-- 表格 -->
    <el-table
      :data="skuBaseList"
      style="width: 100%"
      v-loading="listLoading"
      border
      stripe
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="width">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" width="100" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-download"
            title="下架"
            v-if="row.isSale"
            @click="cancleSale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-upload2"
            title="上架"
            v-else
            @click="onSale(row)"
          ></el-button>

          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改SKU"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            title="查看详情"
            @click="checkSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.skuName}吗?`"
            style="margin-left: 10px"
            @onConfirm="delSku(row)"
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
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      :withHeader="false"
      size="50%"
    >
      <!-- Layout 布局 -->
      <el-row style="margin-top: 20px">
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            :disable-transitions="true"
            v-for="skuAttrValue in skuInfo.skuAttrValueList"
            :key="skuAttrValue.id"
            style="margin-right: 5px"
            >{{ skuAttrValue.attrIdvalueId }}-{{ skuAttrValue.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16"
          ><el-carousel
            height="300"
            style="width: 300px; border: 1px solid #ccc"
          >
            <el-carousel-item
              v-for="skuImage in skuInfo.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" width="300" />
            </el-carousel-item> </el-carousel
        ></el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      // 加载效果
      listLoading: true,
      // 所有SKU列表
      skuBaseList: [],
      // 抽屉的显示与隐藏
      drawer: false,
      // 抽屉数据
      skuInfo: {},
    };
  },
  methods: {
    // 获取数据
    async getSkuBaseList() {
      const result = await this.$API.reqGetBaseSkuList(
        this.pageNum,
        this.pageSize
      );
      if (result.code == 200) {
        this.totalCount = result.data.total;
        this.skuBaseList = result.data.records;
        this.listLoading = false;
      }
    },
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getSkuBaseList();
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSkuBaseList();
    },
    // 上架
    async onSale(row) {
      const result = await this.$API.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message.success("上架成功");
      } else this.$message.error("上架失败");
    },
    // 下架
    async cancleSale(row) {
      const result = await this.$API.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message.success("下架成功");
      } else this.$message.error("下架失败");
    },
    // 修改SKU
    updateSku(row) {
      this.$message("正在开发中...");
    },
    // 查看详情
    async checkSku(row) {
      const result = await this.$API.reqGetSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
        this.drawer = true;
      }
    },
    // 删除SKU
    async delSku(row) {
      const result = await this.$API.reqDelSkuById(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        if (this.skuBaseList.length <= 1 && this.pageNum > 1) this.pageNum--;
        this.getSkuBaseList();
      } else this.$$message.error("删除失败");
    },
  },
  mounted() {
    this.getSkuBaseList();
  },
};
</script>

<style>
.sku .el-col {
  margin-right: 10px;
}

.sku .el-row {
  margin-bottom: 20px;
}

.sku .el-row .el-col-5 {
  text-align: right;
  font-size: 18px;
  font-weight: 700;
}

.sku .el-row:last-child {
  margin-bottom: 0;
}

.sku .el-carousel__button {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: red;
}
</style>