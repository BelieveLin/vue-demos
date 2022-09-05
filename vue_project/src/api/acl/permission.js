import request from "@/utils/request";

// 获取权限菜单列表
export const reqGetPermissionList = () => request({ url: "/admin/acl/permission", method: "get" });

// 添加或修改权限项
export const reqAddorUpdatePermission = (data) => {
  // 添加
  if (!data.id)
    return request({ url: "/admin/acl/permission/save", method: "post", data });
  // 修改
  else
    return request({ url: "/admin/acl/permission/update", method: "put", data });
};

// 删除权限项
export const reqDelPermission = (id) => request({ url: `/admin/acl/permission/remove/${id}`, method: "delete" });

// 查看角色权限
export const reqToAssign = (roleId) => request({ url: `/admin/acl/permission/toAssign/${roleId}`, method: "get" });

// 角色授权
export const reqDoAssign = (params) => request({ url: "/admin/acl/permission/doAssign", method: "post", params });

