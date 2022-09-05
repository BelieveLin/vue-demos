import { reqGetAddressList, reqGetOrderInfo, reqSubmitOrderInfo } from "@/api";

const state = {
    addressList: [],
    orderInfo: {},
    orderId: ""
};

const actions = {
    async getAddressList(context, value) {
        const result = await reqGetAddressList();
        if (result.code == 200)
            context.commit("GETADDRESSLIST", result.data);
    },
    async getOrderInfo(context, value) {
        const result = await reqGetOrderInfo();
        if (result.code == 200)
            context.commit("GETORDERINFO", result.data);
    },
    async submitOrderInfo(context, value) {
        const result = await reqSubmitOrderInfo({ tradeNo: value.tradeNo }, value.data);
        if (result.code == 200) {
            context.commit("SUBMITORDERINFO", result.data);
            return Promise.resolve("ok");
        } else
            return Promise.reject(new Error(result.message))
    },
};

const mutations = {
    GETADDRESSLIST(state, value) {
        state.addressList = value;
    },
    GETORDERINFO(state, value) {
        state.orderInfo = value;
    },
    SUBMITORDERINFO(state, value) {
        state.orderId = value;
    },
};

const getters = {};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}