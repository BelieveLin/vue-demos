<template>
  <div>
    <!-- 表单 -->
    <el-form :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input
          v-model.trim="skuInfo.skuName"
          placeholder="SKU名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          type="number"
          v-model.trim="skuInfo.price"
          placeholder="价格(元)"
          @change="changePrice"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          v-model.trim="skuInfo.weight"
          placeholder="重量(千克)"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model.trim="skuInfo.skuDesc"
          placeholder="规格描述"
          rows="4"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
            :class="{ active: index < parseInt(attrList.length / 3) * 3 }"
          >
            <!-- 选择器 -->
            <el-select v-model="attr.attrIdAndAttrValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              v-model="spuSaleAttr.spuSaleAttrIdAndspuSaleAttrValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuSaleAttrValue.saleAttrName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 表格 -->
        <el-table
          :data="spuImageList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" width="100" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="!row.isDefault"
                @click="changeDafault(row)"
                >设为默认</el-button
              >
              <el-tag type="success" :disable-transitions="true" v-else
                >默认</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuName: "",
      imageList: [],
      skuInfo: {
        category3Id: "",
        spuId: "",
        // 品牌
        tmId: "",
        skuName: "",
        price: "",
        weight: "",
        // 规格描述
        skuDesc: "",
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [],
        // 销售属性
        skuSaleAttrValueList: [],
        // 图片列表
        skuImageList: [],
      },
      // SPU图片列表
      spuImageList: [],
      // 平台属性列表
      attrList: [],
      // SPU销售属性列表
      spuSaleAttrList: [],
    };
  },
  methods: {
    // 添加时获取数据
    async getAddData(category1Id, category2Id, row) {
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spuName = row.spuName;
      // SPU图片列表
      const pSpuImage = this.$API.reqGetSpuImageList(row.id);
      // 平台属性列表
      const pAttrSale = this.$API.reqGetAttrList(
        category1Id,
        category2Id,
        row.category3Id
      );
      // SPU销售属性列表
      const pSpusaleAttr = this.$API.reqGetSpuSaleAttrList(row.id);

      const [spuImageResult, attrResult, spuSaleAttrResult] = await Promise.all(
        [pSpuImage, pAttrSale, pSpusaleAttr]
      );
      if (spuImageResult.code == 200) {
        let ImageList = spuImageResult.data;
        ImageList.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = ImageList;
      }
      if (attrResult.code == 200) this.attrList = attrResult.data;
      if (spuSaleAttrResult.code == 200)
        this.spuSaleAttrList = spuSaleAttrResult.data;
    },
    // 修改价格
    changePrice(value) {
      if (isNaN(value) || value < 0) this.skuInfo.price = "";
    },
    // 勾选单元格
    handleSelectionChange(select) {
      this.imageList = select;
    },
    // 设置默认图片
    changeDafault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 保存
    async addSku() {
      this.skuInfo.skuAttrValueList = this.attrList.reduce((prev, item) => {
        if (item.attrIdAndAttrValueId) {
          const [attrId, valueId] = item.attrIdAndAttrValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (prev, item) => {
          if (item.spuSaleAttrIdAndspuSaleAttrValueId) {
            const [saleAttrId, saleAttrValueId] =
              item.spuSaleAttrIdAndspuSaleAttrValueId.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
          return prev;
        },
        []
      );
      this.skuInfo.skuImageList = this.imageList.map((item) => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        isDefault: item.isDefault,
        spuImgId: item.id,
      }));
      let skuAttrValueListFlag =
        this.skuInfo.skuAttrValueList.length || this.attrList.length == 0
          ? true
          : false;
      let skuSaleAttrValueListFlag =
        this.skuInfo.skuSaleAttrValueList.length ||
        this.spuSaleAttrList.length == 0
          ? true
          : false;
      let skuImageListFlag =
        this.skuInfo.skuImageList.length || this.spuImageList.length == 0
          ? true
          : false;

      if (
        skuAttrValueListFlag &&
        skuSaleAttrValueListFlag &&
        skuImageListFlag
      ) {
        try {
          const result = await this.$API.reqAddSku(this.skuInfo);
          if (result.code == 200) {
            this.$message.success("保存成功");
          } else this.$message.error("保存失败");
        } catch (err) {
          this.$message.info("已取消保存");
        } finally {
          this.$emit("changeScene", { scene: 0, flag: "添加SKU" });
          Object.assign(this._data, this.$options.data());
        }
      } else this.$message.warning("提交内容不能为空");
    },
    // 取消
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "取消SKU" });
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style scoped>
.active {
  margin-bottom: 10px;
}
</style>