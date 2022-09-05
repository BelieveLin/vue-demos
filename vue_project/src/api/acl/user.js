import request from "@/utils/request";

// 登录
export const reqUserLogin = (data) => request({ url: "/admin/acl/index/login", method: "post", data });

// 退出登录
export const reqUserLogout = () => request({ url: "/admin/acl/index/logout", method: "post" });

// 获取用户信息
export const reqGetUserInfo = (params) => request({ url: "/admin/acl/index/info", method: "get", params });

// 获取用户列表
export const reqGetUserList = (page, limit, params) => request({ url: `/admin/acl/user/${page}/${limit}`, method: "get", params });

// 添加或修改用户
export const reqAddOrUpdateUser = (data) => {
  // 添加
  if (!data.id)
    return request({ url: "/admin/acl/user/save", method: "post", data });
  // 修改
  else
    return request({ url: "/admin/acl/user/update", method: "put", data });
}

// 删除用户
export const reqDelUser = (id) => request({ url: `/admin/acl/user/remove/${id}`, method: "delete" });

// 批量删除用户
export const reqDelUsers = (data) => request({ url: "/admin/acl/user/batchRemove", method: "delete", data });

// 获取用户的权限列表
export const reqGetUserAssignList = (userId) => request({ url: `/admin/acl/user/toAssign/${userId}`, method: "get" });

// 分配角色
export const reqAssignRoles = (params) => request({ url: "/admin/acl/user/doAssign", method: "post", params });


