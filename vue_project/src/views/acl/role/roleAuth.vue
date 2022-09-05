<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <!-- 树形控件 -->
    <el-tree
      style="margin: 20px 0"
      ref="tree"
      :data="permissionList"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
  </div>
</template>
<script>
export default {
  name: "RoleAuth",
  data() {
    return {
      // 加载效果
      loading: false,
      // 权限菜单列表
      permissionList: [],
      // 配置选项
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    // 获取数据
    async getPermissionList() {
      const result = await this.$API.reqToAssign(this.$route.params.id);
      if (result.code == 20000) {
        this.permissionList = result.data.children;
        let checkedIds = this.getCheckedIds(result.data.children);
        // 通过key设置目前选中的节点
        this.$refs.tree.setCheckedKeys(checkedIds);
      }
    },
    // 获取选中的ID列表
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && item.level === 4) {
          pre.push(item.id);
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr);
        }
        return pre;
      }, initArr);
    },
    // 保存
    async save() {
      this.loading = true;
      const result = await this.$API.reqDoAssign({
        roleId: this.$route.params.id,
        // 被选中的节点的key所组成的数组
        permissionId: this.$refs.tree.getCheckedKeys().join(","),
      });
      if (result.code == 20000) {
        this.loading = false;
        this.$message.success("分配成功");
        const roles = this.$store.getters.roles;
        const roleName = this.$route.query.roleName;
        this.$router.replace("/acl/role", () => {
          // 更新的是当前用户所对应角色的权限
          if (roles.includes(roleName)) {
            window.location.reload();
          }
        });
      } else this.$message.error("分配失败");
    },
  },
  mounted() {
    this.getPermissionList();
  },
};
</script>
