import { reqGetCategoryList, reqGetBannerList, reqGetFloorList } from "@/api";

const state = {
    categoryList: [],
    bannerList: [],
    floorList: []
};

const actions = {
    async getCategoryList(context, value) {
        const result = await reqGetCategoryList();
        if (result.code == 200)
            context.commit("GETCATEGORYLIST", result.data);
    },
    async getBannerList(context, value) {
        const result = await reqGetBannerList();
        if (result.code == 200)
            context.commit("GETBANNERLIST", result.data);
    },
    async getFloorList(context, value) {
        const result = await reqGetFloorList();
        if (result.code == 200)
            context.commit("GETFLOORLIST", result.data);
    },
};

const mutations = {
    GETCATEGORYLIST(state, value) {
        state.categoryList = value;
    },
    GETBANNERLIST(state, value) {
        state.bannerList = value;
    },
    GETFLOORLIST(state, value) {
        state.floorList = value;
    }
};

const getters = {};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}