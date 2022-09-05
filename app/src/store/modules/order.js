import { reqGetMyOrderInfo } from "@/api";

const state = {
    myOrderInfo: {}
};

const actions = {
    async getMyOrderInfo(context, value) {
        const result = await reqGetMyOrderInfo(value.page, value.limit);
        if (result.code == 200)
            context.commit("GETMYORDERINFO", result.data);
    }
};

const mutations = {
    GETMYORDERINFO(state, value) {
        state.myOrderInfo = value;
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