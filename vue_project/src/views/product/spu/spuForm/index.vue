<template>
  <div class="spuForm">
    <!-- 表单 -->
    <el-form ref="form" :model="spuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input
          v-model.trim="spuInfo.spuName"
          placeholder="SPU名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择">
          <el-option
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model.trim="spuInfo.description"
          placeholder="SPU描述"
          rows="4"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 选择器 -->
        <el-select
          v-model="saleAttrIdAndSaleAttrName"
          :placeholder="`还有${unSelectSaleAttrList.length}个未选择`"
          style="margin: 0 12px 22px 0"
        >
          <el-option
            v-for="unSelect in unSelectSaleAttrList"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!saleAttrIdAndSaleAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 表格 -->
        <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                closable
                :disable-transitions="true"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                @close="delSaleAttrValue(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model.trim="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗?`"
                @onConfirm="delSaleAttr($index)"
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addorUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 对话框的显示与隐藏
      dialogVisible: false,
      // 对话框预览图片
      dialogImageUrl: "",
      // 未选择的销售属性
      saleAttrIdAndSaleAttrName: "",
      // SPU信息
      spuInfo: {
        category3Id: "",
        // 品牌
        tmId: "",
        // SPU名称
        spuName: "",
        // SPU描述
        description: "",
        // SPU图片
        spuImageList: [],
        // 销售属性
        spuSaleAttrList: [],
      },
      // 品牌列表
      tradeMarkList: [],
      // SPU图片列表
      spuImageList: [],
      // 所有销售属性列表
      baseSaleAttrList: [],
    };
  },
  computed: {
    // 未选择的销售属性列表
    unSelectSaleAttrList() {
      return this.baseSaleAttrList.filter((item1) => {
        return this.spuInfo.spuSaleAttrList.every(
          (item2) => item2.saleAttrName != item1.name
        );
      });
    },
  },
  methods: {
    // 添加时获取数据
    async getAddData(category3Id) {
      // 三级分类
      this.spuInfo.category3Id = category3Id;
      // 品牌列表
      const pTradeMark = this.$API.reqGetTradeMarkList();
      // 所有销售属性列表
      const pBaseSaleAttr = this.$API.reqGetBaseSaleAttrList();

      const [tradeMarkResult, baseSaleAttrResult] = await Promise.all([
        pTradeMark,
        pBaseSaleAttr,
      ]);
      if (tradeMarkResult.code == 200)
        this.tradeMarkList = tradeMarkResult.data;
      if (baseSaleAttrResult.code == 200)
        this.baseSaleAttrList = baseSaleAttrResult.data;
    },
    // 修改时获取数据
    async getUpdateData(row) {
      // SPU信息
      const pSpuInfo = this.$API.reqGetSpuInfo(row.id);
      // 品牌列表
      const pTradeMark = this.$API.reqGetTradeMarkList();
      // SPU图片列表
      const pSpuImage = this.$API.reqGetSpuImageList(row.id);
      // 所有销售属性列表
      const pBaseSaleAttr = this.$API.reqGetBaseSaleAttrList();

      const [spuResult, tradeMarkResult, spuImageResult, baseSaleAttrResult] =
        await Promise.all([
          pSpuInfo,
          pTradeMark,
          pSpuImage,
          pBaseSaleAttr,
        ]);

      if (spuResult.code == 200) this.spuInfo = spuResult.data;
      if (tradeMarkResult.code == 200)
        this.tradeMarkList = tradeMarkResult.data;
      if (spuImageResult.code == 200) {
        let ImageList = spuImageResult.data;
        ImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = ImageList;
      }
      if (baseSaleAttrResult.code == 200)
        this.baseSaleAttrList = baseSaleAttrResult.data;
    },
    // 添加图片
    handleSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] =
        this.saleAttrIdAndSaleAttrName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.saleAttrIdAndSaleAttrName = "";
    },
    // 删除销售属性
    delSaleAttr(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },
    // 添加销售属性值（聚焦）
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 失焦
    handleInputConfirm(row) {
      if (row.inputValue == "") {
        this.$message.warning("属性值不能为空");
        return;
      }
      let isRep = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == row.inputValue
      );
      if (isRep) {
        this.$message.warning("属性值不能重复");
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue,
      });
      row.inputVisible = false;
    },
    // 删除销售属性值
    delSaleAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 确认添加或修改
    async addorUpdateSpu() {
      this.spuInfo.spuImageList = this.spuImageList.map((item) => ({
        imgName: item.name,
        imgUrl: item.imgUrl || item.response.data,
      }));
      this.spuInfo.spuSaleAttrList.forEach((item) => {
        item.spuSaleAttrValueList.forEach((item) => {
          delete item.inputVisible;
          delete item.inputValue;
        });
      });
      if (
        this.spuInfo.spuSaleAttrList.length &&
        this.spuInfo.spuSaleAttrList[0].spuSaleAttrValueList.length
      ) {
        try {
          const result = await this.$API.reqAddorUpdateSpu(this.spuInfo);
          if (result.code == 200) {
            this.$message.success(`${this.spuInfo.id ? "修改" : "添加"}成功`);
          } else
            this.$message.error(`${this.spuInfo.id ? "修改" : "添加"}失败`);
        } catch (err) {
          this.$message.info(`已取消${this.spuInfo.id ? "修改" : "添加"}`);
        } finally {
          this.$emit("changeScene", {
            scene: 0,
            flag: this.spuInfo.id ? "修改SPU" : "添加SPU",
          });
          Object.assign(this._data, this.$options.data());
        }
      } else this.$message.warning("提交内容不能为空");
    },
    // 取消
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "取消SPU" });
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.spuForm .el-tag + .el-tag {
  margin-left: 10px;
}
.spuForm .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.spuForm .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>