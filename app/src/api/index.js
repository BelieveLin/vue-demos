// 统一管理接口

import request from "./request";
import mock from "./mock";

// 三级联动
export const reqGetCategoryList = () => request({ url: "/product/getBaseCategoryList", method: "get" });

// 轮播图
export const reqGetBannerList = () => mock({ url: "/banner" });

// 楼层数据
export const reqGetFloorList = () => mock({ url: "/floor" });

// 搜索数据
export const reqGetSearchInfo = (data) => request({ url: "/list", method: "post", data });

// 商品数据
export const reqGetGoodInfo = (skuId) => request({ url: `/item/${skuId}`, method: "get" });

// 添加到购物车 / 更新购物车中商品个数
export const reqAddOrUpdateShopCart = (skuId, skuNum) => request({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });

// 购物车数据
export const reqGetCartList = () => request({ url: "/cart/cartList", method: "get" });

// 删除购物车商品
export const reqDelCartById = (skuId) => request({ url: `/cart/deleteCart/${skuId}`, method: "delete" });

// 购物车商品选中状态
export const reqUpdateCheckedById = (skuId, isChecked) => request({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" });

// 验证码
export const reqGetCode = (phone) => request({ url: `/user/passport/sendCode/${phone}`, method: "get" });

// 注册
export const reqUserRegister = (data) => request({ url: "/user/passport/register", method: "post", data });

// 登录
export const reqUserLogin = (data) => request({ url: "/user/passport/login", method: "post", data });

// 用户信息
export const reqGetUserInfo = () => request({ url: "/user/passport/auth/getUserInfo", method: "get" });

// 退出登录
export const reqUserLogout = () => request({ url: "/user/passport/logout", method: "get" });

// 地址信息
export const reqGetAddressList = () => request({ url: "/user/userAddress/auth/findUserAddressList", method: "get" });

// 商品订单
export const reqGetOrderInfo = () => request({ url: "/order/auth/trade", method: "get" });

// 提交订单
export const reqSubmitOrderInfo = (params, data) => request({ url: "/order/auth/submitOrder", method: "post", params, data })

// 支付信息
export const reqGetPayInfo = (orderId) => request({ url: `/payment/weixin/createNative/${orderId}`, method: "get" });

// 支付状态
export const reqGetPayStatus = (orderId) => request({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: "get" });

// 我的订单
export const reqGetMyOrderInfo = (page, limit) => request({ url: `/order/auth/${page}/${limit}`, method: "get" });
