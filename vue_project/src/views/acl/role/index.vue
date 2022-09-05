<template>
  <div>
    <!-- 表单 -->
    <el-form inline>
      <el-form-item>
        <el-input
          v-model.trim="tempSearchInfo.roleName"
          placeholder="角色名称"
          @keyup.native.enter="search"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button @click="resetSearch">清空</el-button>
    </el-form>
    <el-button type="primary" icon="el-icon-plus" @click="addRole"
      >添加</el-button
    >
    <el-button
      type="danger"
      icon="el-icon-delete"
      @click="removeRoles"
      :disabled="selectedRoleList.length === 0"
      >批量删除</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="roleList"
      @selection-change="handleSelectionChange"
      style="margin: 20px 0"
      v-loading="listLoading"
      border
      stripe
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="{ row }">
          <template v-if="row.inputVisible">
            <el-input
              v-model.trim="row.roleName"
              class="edit-input"
              size="small"
            />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancel(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="info"
            icon="el-icon-info"
            title="分配权限"
            @click="
              $router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)
            "
          >
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            title="确定"
            @click="updateRole(row)"
            v-if="row.inputVisible"
          >
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            title="修改角色"
            @click="row.inputVisible = true"
            v-else
          >
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            title="删除角色"
            @click="removeRole(row)"
          >
          </el-button>
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
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      // 加载效果
      listLoading: true,
      // 角色列表
      roleList: [],
      // 选中的角色列表
      selectedRoleList: [],
      // 搜索条件的发送对象
      searchInfo: {
        roleName: "",
      },
      // 搜索条件的收集对象
      tempSearchInfo: {
        roleName: "",
      },
    };
  },
  methods: {
    // 获取数据
    async getRoleList() {
      const result = await this.$API.reqGetRoleList(
        this.pageNum,
        this.pageSize,
        this.searchInfo
      );
      if (result.code == 20000) {
        this.roleList = result.data.items.map((item) => {
          item.originRoleName = item.roleName;
          item.inputVisible = false;
          return item;
        });
        this.totalCount = result.data.total;
        this.listLoading = false;
      }
    },
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getRoleList();
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getRoleList();
    },
    // 搜索
    search() {
      this.searchInfo = { ...this.tempSearchInfo };
      this.getRoleList();
    },
    // 重置搜索
    resetSearch() {
      this.tempSearchInfo = {
        roleName: "",
      };
      this.searchInfo = {
        roleName: "",
      };
      this.getRoleList();
    },
    // 勾选单元格
    handleSelectionChange(selection) {
      this.selectedRoleList = selection;
    },
    // 添加角色
    addRole() {
      this.$prompt("请输入新名称", "添加角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          const result = await this.$API.reqAddRole({ roleName: value });
          if (result.code == 20000) {
            this.$message.success("添加成功");
            this.pageNum = 1;
            this.getRoleList();
          } else this.$message.error("添加失败");
        })
        .catch((err) => {
          this.$message.info("已取消添加");
        });
    },
    // 修改角色
    async updateRole(row) {
      const result = await this.$API.reqUpdateRole({
        id: row.id,
        roleName: row.roleName,
      });
      if (result.code == 20000) {
        this.$message.success("修改成功");
        this.getRoleList();
      } else this.$message.error("修改失败");
    },
    // 取消修改
    cancel(row) {
      row.roleName = row.originRoleName;
      row.inputVisible = false;
      this.$message.info("已取消修改");
    },
    // 删除
    removeRole(row) {
      this.$confirm(`确定删除 '${row.roleName}' 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.reqDelRole(row.id);
          if (result.code == 20000) {
            this.$message.success("删除成功");
            if (this.roleList.length <= 1 && this.pageNum > 1) this.pageNum--;
            this.getRoleList();
          } else this.$message.error("删除失败");
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
    // 批量删除
    removeRoles() {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const ids = this.selectedRoleList.map((role) => role.id);
          const result = await this.$API.reqDelRoles(ids);
          if (result.code == 20000) {
            this.$message.success("删除成功");
            if (this.roleList.length <= ids.length && this.pageNum > 1)
              this.pageNum--;
            this.getRoleList();
          } else this.$message.error("删除失败");
        })
        .catch((err) => {
          this.$message.info("已取消删除");
        });
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>