<template>
  <div>
    <!-- 表格 -->
    <el-table
      :data="permissionList"
      :expand-row-keys="expandKeys"
      row-key="id"
      style="margin-bottom: 20px"
      v-loading="listLoading"
      border
      stripe
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="toCode" label="跳转权限值" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.level === 4"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addPermission(row)"
            :title="getAddTitle(row.level)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            :disabled="row.level === 1"
            @click="updatePermission(row)"
            :title="row.level === 4 ? '修改功能' : '修改菜单'"
          ></el-button>
          <el-button
            :disabled="row.level === 1"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delPermission(row)"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :title="dialogTitle"
      @close="cancel"
    >
      <!-- 表单 -->
      <el-form
        ref="permission"
        :model="permissionInfo"
        :rules="permissionRules"
        label-width="120px"
      >
        <el-form-item
          label="父级名称"
          v-show="permissionInfo.level > 2 && !permissionInfo.id"
        >
          <el-input :value="permissionInfo.pname" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="permissionInfo.name" />
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model.trim="permissionInfo.code" />
        </el-form-item>
        <el-form-item
          label="跳转路由权限值"
          prop="toCode"
          v-show="permissionInfo.level === 4"
        >
          <el-input v-model.trim="permissionInfo.toCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Permission",
  data() {
    return {
      // 权限菜单列表
      permissionList: [],
      // 展开项
      expandKeys: [],
      // 对话框的显示与隐藏
      dialogPermissionVisible: false,
      // 加载效果
      listLoading: true,
      permissionInfo: {
        level: 0,
        name: "",
        code: "",
        toCode: "",
      },
      // 菜单权限的校验规则
      menuRules: {
        name: [{ required: true, message: "名称必须输入" }],
        code: [{ required: true, message: "权限值必须输入" }],
      },
      // 按钮功能权限的校验规则
      btnRules: {
        name: [{ required: true, message: "名称必须输入" }],
        code: [
          { required: true, trigger: "blur", message: "功能权限值必须输入" },
        ],
      },
    };
  },
  computed: {
    // 对话框标题
    dialogTitle() {
      if (this.permissionInfo.id) {
        return this.permissionInfo.level === 4 ? "修改功能" : "修改菜单";
      } else {
        return this.permissionInfo.level === 4
          ? "添加功能"
          : `添加${this.permissionInfo.level === 2 ? "一级" : "二级"}菜单`;
      }
    },
    // 校验规则
    permissionRules() {
      return this.permissionInfo.level === 4 ? this.btnRules : this.menuRules;
    },
  },

  methods: {
    // 获取数据
    async getPermissionList() {
      const result = await this.$API.reqGetPermissionList();
      if (result.code == 20000) {
        this.permissionList = result.data.children;
        this.expandKeys = [this.permissionList[0].id];
        this.listLoading = false;
      }
    },
    // 获取添加按钮的提示文本
    getAddTitle(level) {
      if (level === 1 || level === 2) {
        return "添加菜单";
      } else if (level === 3) {
        return "添加功能";
      }
    },
    // 添加
    addPermission(row) {
      this.permissionInfo.pid = row.id;
      this.permissionInfo.level = row.level + 1;
      this.permissionInfo.type = this.permissionInfo.level === 4 ? 2 : 1;
      this.permissionInfo.pname = row.name;
      this.dialogPermissionVisible = true;
      this.$nextTick(() => this.$refs.permission.clearValidate());
    },
    // 修改
    updatePermission(row) {
      this.permissionInfo = { ...row };
      this.permissionInfo.type = this.permissionInfo.level === 4 ? 2 : 1;
      this.dialogPermissionVisible = true;
      this.$nextTick(() => this.$refs.permission.clearValidate());
    },
    // 删除
    delPermission(row) {
      this.$confirm(`确定删除${row.name}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.reqDelPermission(row.id);
          if (result.code == 20000) {
            this.$message.success("删除成功");
            this.getPermissionList();
          } else this.$message.error("删除失败");
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
    // 取消
    cancel() {
      this.dialogPermissionVisible = false;
      this.permissionInfo = {
        level: 0,
        name: "",
        code: "",
        toCode: "",
      };
    },
    // 确认添加或修改
    addOrUpdatePermission() {
      this.$refs.permission.validate(async (valid) => {
        if (valid) {
          const { pname, ...perm } = this.permissionInfo;
          const result = await this.$API.reqAddorUpdatePermission(perm);
          if (result.code == 20000) {
            this.$message.success(`${perm.id ? "修改" : "添加"}成功!`);
            this.cancel();
            this.getPermissionList();
          } else
            this.$message.error(`${this.userInfo.id ? "修改" : "添加"}失败`);
        }
      });
    },
  },
  mounted() {
    this.getPermissionList();
  },
};
</script>
