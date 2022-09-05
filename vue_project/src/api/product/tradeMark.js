import request from "@/utils/request";

// 获取品牌列表
export const reqGetPageTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: "get" });

// 添加或修改品牌
export const reqAddorUpdateTradeMark = (data) => {
    // 添加
    if (!data.id)
        return request({ url: "/admin/product/baseTrademark/save", method: "post", data });
    // 修改
    else
        return request({ url: "/admin/product/baseTrademark/update", method: "put", data });
};

// 删除品牌
export const reqDelTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: "delete" });


