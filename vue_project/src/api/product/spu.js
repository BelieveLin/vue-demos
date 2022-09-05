import request from "@/utils/request";

// 获取SPU列表
export const reqGetSpuList = (page, limit, params) => request({ url: `/admin/product/${page}/${limit}`, method: "get", params });

// 获取SPU信息
export const reqGetSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" });

// 获取品牌列表
export const reqGetTradeMarkList = () => request({ url: "/admin/product/baseTrademark/getTrademarkList", method: "get" });

// 获取SPU图片列表
export const reqGetSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

// 获取所有销售属性列表
export const reqGetBaseSaleAttrList = () => request({ url: "/admin/product/baseSaleAttrList", method: "get" });

// 获取SPU销售属性列表
export const reqGetSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

// 添加或修改SPU
export const reqAddorUpdateSpu = (data) => {
    // 添加
    if (!data.id)
        return request({ url: "/admin/product/saveSpuInfo", method: "post", data });
    // 修改
    else
        return request({ url: "/admin/product/updateSpuInfo", method: "post", data });
};

// 删除SPU 
export const reqDelSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" });

// 添加SKU
export const reqAddSku = (data) => request({ url: "/admin/product/saveSkuInfo", method: "post", data });

// 获取SKU列表 
export const reqGetSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });

