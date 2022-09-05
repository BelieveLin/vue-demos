import request from "@/utils/request";

// 获取角色列表
export const reqGetRoleList = (page, limit, params) => request({ url: `/admin/acl/role/${page}/${limit}`, method: "get", params });

// 添加角色
export const reqAddRole = (data) => request({ url: "/admin/acl/role/save", method: "post", data });

// 修改角色
export const reqUpdateRole = (data) => request({ url: "/admin/acl/role/update", method: "put", data });

// 获取角色的权限列表
export const reqGetRoleAssignList = (roleId) => request({ url: `/admin/acl/role/toAssign/${roleId}`, method: "get" });

// 删除角色
export const reqDelRole = (id) => request({ url: `/admin/acl/role/remove/${id}`, method: "delete" });

// 批量删除角色
export const reqDelRoles = (data) => request({ url: "/admin/acl/role/batchRemove", method: "delete", data });


