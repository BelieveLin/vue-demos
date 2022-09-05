import request from "@/utils/request";

// 一级分类
export const reqGetCategory1List = () => request({ url: "/admin/product/getCategory1", method: "get" });

// 二级分类
export const reqGetCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" });

// 三级分类
export const reqGetCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" });

// 获取平台属性列表
export const reqGetAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get" });

// 添加平台属性和属性值
export const reqAddorUpdateAttrInfo = (data) => request({ url: "/admin/product/saveAttrInfo", method: "post", data });

// 删除平台属性
export const reqDelAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: "delete" });