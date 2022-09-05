<template>
  <div class="tradeMark">
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="pageList"
      style="width: 100%; margin: 20px 0"
      v-loading="listLoading"
      border
      stripe
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            title="修改"
            @click="updateTradeMark(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除"
            @click="delTradeMark(row)"
          ></el-button>
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
    <!-- 对话框 -->
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 表单 -->
      <el-form
        :model="tmForm"
        :rules="rules"
        ref="ruleForm"
        style="width: 80%; margin: 0 auto"
      >
        <el-form-item label="品牌名称" prop="tmName" label-width="100px">
          <el-input v-model.trim="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png图片，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      // 加载效果
      listLoading: true,
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      // 表格数据
      pageList: [],
      // 品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    // 获取数据
    async getPageList() {
      const result = await this.$API.reqGetPageTradeMarkList(
        this.pageNum,
        this.pageSize
      );
      if (result.code == 200) {
        this.totalCount = result.data.total;
        this.pageList = result.data.records;
        this.listLoading = false;
      }
    },
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getPageList();
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPageList();
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPGorPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGorPNG) {
        this.$message.error("上传的图片只能是 JPG 或 PNG 格式");
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB");
      }
      return isJPGorPNG && isLt2M;
    },
    // 添加
    addTradeMark() {
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
      this.dialogFormVisible = true;
    },
    // 修改
    updateTradeMark(row) {
      this.tmForm = { ...row };
      this.dialogFormVisible = true;
    },
    // 确认添加或修改
    addOrUpdateTradeMark() {
      this.dialogFormVisible = false;
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const result = await this.$API.reqAddorUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            this.$message.success(`${this.tmForm.id ? "修改" : "添加"}成功`);
            if (!this.tmForm.id) this.pageNum = 1;
            this.getPageList();
          } else this.$message.error(`${this.tmForm.id ? "修改" : "添加"}失败`);
        }
      });
      this.$nextTick(() => this.$refs.ruleForm.clearValidate());
    },
    // 删除
    delTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.reqDelTradeMark(row.id);
          if (result.code == 200) {
            this.$message.success("删除成功");
            if (this.pageList.length <= 1 && this.pageNum > 1) this.pageNum--;
            this.getPageList();
          } else this.$message.error("删除失败");
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.tradeMark .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.tradeMark .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.tradeMark .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.tradeMark .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
