import { reqGetSearchInfo } from "@/api"

const state = {
    searchInfo: {}
};

const actions = {
    async getSearchInfo(context, value = {}) {
        const result = await reqGetSearchInfo(value);
        if (result.code == 200)
            context.commit("GETSEARCHINFO", result.data);
    }
};

const mutations = {
    GETSEARCHINFO(state, value) {
        state.searchInfo = value;
    }
};

const getters = {
    total(state) {
        return state.searchInfo.total || "";
    },
    goodsList(state) {
        return state.searchInfo.goodsList || [];
    },
    attrsList(state) {
        return state.searchInfo.attrsList || [];
    },
    trademarkList(state) {
        return state.searchInfo.trademarkList || [];
    }

};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}