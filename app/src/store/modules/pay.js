import { reqGetPayInfo, reqGetPayStatus } from "@/api";

const state = {
    payInfo: {}
};

const actions = {
    async getPayInfo(context, value) {
        const result = await reqGetPayInfo(value.orderId);
        if (result.code == 200) {
            context.commit("GETPAYINFO", result.data);
            return Promise.resolve("ok");
        } else
            return Promise.reject(new Error(result.message));
    },
    async getPayStatus(context, value) {
        const result = await reqGetPayStatus(value.orderId);
        return Promise.resolve(result.code);
    },
};

const mutations = {
    GETPAYINFO(state, value) {
        state.payInfo = value;
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