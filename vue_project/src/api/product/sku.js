import request from "@/utils/request";

// 获取所有SKU列表
export const reqGetBaseSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });

// 下架
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" });

// 上架
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: "get" });

// 获取SKU
export const reqGetSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" });

// 删除SKU
export const reqDelSkuById = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: "delete" });