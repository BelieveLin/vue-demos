<template>
  <div>
    <!-- 表单 -->
    <el-form inline>
      <el-form-item>
        <el-input
          v-model.trim="tempSearchInfo.username"
          placeholder="用户名"
          @keyup.native.enter="search"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <el-button type="primary" icon="el-icon-plus" @click="addUser"
      >添加</el-button
    >
    <el-button
      type="danger"
      icon="el-icon-delete"
      @click="delUsers"
      :disabled="selectedUsersIds.length === 0"
      >批量删除</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="userList"
      @selection-change="handleSelectionChange"
      style="margin: 20px 0"
      border
      stripe
      v-loading="listLoading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="权限列表" />
      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column prop="gmtModified" label="更新时间" width="180" />
      <el-table-column label="操作" width="230">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="toAssignRole(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="updateUser(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除 ${row.username} 吗?`"
            @onConfirm="delUser(row.id)"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
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
    />
    <!-- 对话框 -->
    <el-dialog
      :title="userInfo.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogUserVisible"
    >
      <!-- 表单 -->
      <el-form
        ref="userForm"
        :model="userInfo"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="userInfo.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model.trim="userInfo.nickName" />
        </el-form-item>

        <el-form-item v-show="!userInfo.id" label="用户密码" prop="password">
          <el-input v-model.trim="userInfo.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdateUser"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 对话框 -->
    <el-dialog
      title="设置角色"
      :visible.sync="dialogRoleVisible"
      :before-close="resetRoleData"
    >
      <!-- 表单 -->
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- 多选框 -->
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="isCheckedAll"
            @change="handleRolesCheckedAll"
            style="margin: 15px 0"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="selectedRolesIds"
            @change="handleRolesChecked"
          >
            <el-checkbox
              v-for="role in allRoleList"
              :key="role.id"
              :label="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole"
          >保存</el-button
        >
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "User",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      // 表格加载效果
      listLoading: false,
      // 提交加载效果
      loading: false,
      // 搜索条件的发送对象
      searchInfo: {
        username: "",
      },
      // 搜索条件的收集对象
      tempSearchInfo: {
        username: "",
      },
      // 所有用户列表
      userList: [],
      // 选中的用户ID
      selectedUsersIds: [],
      userInfo: {},
      // 所有角色列表
      allRoleList: [],
      // 选中的角色ID
      selectedRolesIds: [],
      // 用户对话框的显示与隐藏
      dialogUserVisible: false,
      // 角色对话框的显示与隐藏
      dialogRoleVisible: false,
      // 角色是否全选
      isCheckedAll: false,
      // 角色的全选状态
      isIndeterminate: false,
      // 表单的校验规则
      userRules: {
        username: [{ required: true, validator: this.validateUserName }],
        password: [{ required: true, validator: this.validatePassword }],
      },
    };
  },

  methods: {
    // 获取数据
    async getUserList() {
      this.listLoading = true;
      const result = await this.$API.reqGetUserList(
        this.pageNum,
        this.pageSize,
        this.searchInfo
      );
      if (result.code == 20000) {
        this.listLoading = false;
        this.userList = result.data.items.filter(
          (item) => item.username !== "admin"
        );
        this.totalCount = result.data.total - 1;
        this.selectedUsersIds = [];
      }
    },
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getUserList();
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUserList();
    },
    // 用户名校验
    validateUserName(rule, value, callback) {
      if (!value) {
        callback("用户名必须输入");
      } else if (!value || value.length < 4) {
        callback("用户名不能小于4位");
      } else {
        callback();
      }
    },
    // 密码校验
    validatePassword(rule, value, callback) {
      if (!value) {
        callback("密码必须输入");
      } else if (!value || value.length < 6) {
        callback("密码不能小于6位");
      } else {
        callback();
      }
    },
    // 搜索
    search() {
      this.searchInfo = { ...this.tempSearchInfo };
      this.getUserList();
    },
    // 重置搜索
    resetSearch() {
      this.searchInfo = {
        username: "",
      };
      this.tempSearchInfo = {
        username: "",
      };
      this.getUserList();
    },
    // 勾选用户单元格
    handleSelectionChange(selection) {
      this.selectedUsersIds = selection.map((item) => item.id);
    },
    // 添加用户
    addUser() {
      this.userInfo = {};
      this.dialogUserVisible = true;
      this.$nextTick(() => this.$refs.userForm.clearValidate());
    },
    // 修改用户
    updateUser(userInfo) {
      this.userInfo = cloneDeep(userInfo);
      this.dialogUserVisible = true;
    },
    // 删除用户
    async delUser(id) {
      const result = await this.$API.reqDelUser(id);
      if (result.code == 20000) {
        this.$message.success("删除成功");
        if (this.userList.length <= 1 && this.pageNum > 1) this.pageNum--;
        this.getUserList();
      } else this.$message.error("删除失败");
    },
    // 批量删除用户
    delUsers() {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.reqDelUsers(this.selectedUsersIds);
          if (result.code == 20000) {
            if (
              this.userList.length <= this.selectedUsersIds.length &&
              this.pageNum > 1
            )
              this.pageNum--;
            this.$message.success("删除成功");
            this.getUserList();
          } else this.$message.error("删除失败");
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
    // 取消
    cancel() {
      this.dialogUserVisible = false;
      this.userInfo = {};
    },
    // 确认添加或修改
    addOrUpdateUser() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const result = await this.$API.reqAddOrUpdateUser(this.userInfo);
            if (result.code == 20000) {
              this.loading = false;
              this.$message.success(
                `${this.userInfo.id ? "修改" : "添加"}成功`
              );
              this.pageNum = this.userInfo.id ? this.pageNum : 1;
              this.getUserList();
            } else {
              this.$message.error(`${this.userInfo.id ? "修改" : "添加"}失败`);
            }
          } catch (err) {
            this.$message.error(`${this.userInfo.id ? "修改" : "添加"}失败`);
          } finally {
            this.dialogUserVisible = false;
            this.loading = false;
            this.userInfo = {};
          }
        }
      });
    },
    // 分配角色
    toAssignRole(row) {
      this.userInfo = row;
      this.getUserAssignList();
      this.dialogRoleVisible = true;
    },
    // 获取用户的权限列表
    async getUserAssignList() {
      const result = await this.$API.reqGetUserAssignList(this.userInfo.id);
      if (result.code == 20000) {
        this.allRoleList = result.data.allRolesList;
        this.selectedRolesIds = result.data.assignRoles.map((item) => item.id);
        this.isCheckedAll =
          result.data.allRolesList.length == result.data.assignRoles.length;
        this.isIndeterminate =
          result.data.assignRoles.length > 0 &&
          result.data.assignRoles.length < result.data.allRolesList.length;
      }
    },
    // 勾选角色总选框
    handleRolesCheckedAll(value) {
      this.selectedRolesIds = value
        ? this.allRoleList.map((item) => item.id)
        : [];
      this.isIndeterminate =
        this.selectedRolesIds.length > 0 &&
        this.selectedRolesIds.length < this.allRoleList.length;
    },
    // 勾选角色多选框
    handleRolesChecked(value) {
      this.isCheckedAll =
        this.selectedRolesIds.length == this.allRoleList.length &&
        this.allRoleList.length > 0;
      this.isIndeterminate =
        this.selectedRolesIds.length > 0 &&
        this.selectedRolesIds.length < this.allRoleList.length;
    },
    // 确认角色授权
    async assignRole() {
      this.loading = true;
      const result = await this.$API.reqAssignRoles({
        userId: this.userInfo.id,
        roleId: this.selectedRolesIds.join(","),
      });
      if (result.code == 20000) {
        this.loading = false;
        this.$message.success("分配成功");
        this.resetRoleData();
        // 更新的是当前用户的权限
        if (this.$store.getters.name === this.userInfo.username) {
          window.location.reload();
        }
      } else this.$message.error("分配失败");
    },
    // 重置角色数据
    resetRoleData() {
      this.dialogRoleVisible = false;
      this.isCheckedAll = false;
      this.isIndeterminate = false;
      this.allRoleList = [];
      this.selectedRolesIds = [];
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style scoped>
</style>
