import { reqGetGoodInfo, reqAddOrUpdateShopCart } from "@/api";
import { getUUID } from "@/utils/uuid_token";


const state = {
    goodInfo: {},
    uuid_token: getUUID()
};

const actions = {
    async getGoodInfo(context, value) {
        const result = await reqGetGoodInfo(value.skuId);
        if (result.code == 200)
            context.commit("GETGOODINFO", result.data);
    },
    async addOrUpdateShopCart(context, value) {
        const result = await reqAddOrUpdateShopCart(value.skuId, value.skuNum);
        if (result.code == 200)
            return Promise.resolve("ok");
        else
            return Promise.reject(new Error(result.message));
    }
};

const mutations = {
    GETGOODINFO(state, value) {
        state.goodInfo = value;
    }
};

const getters = {
    categoryView(state) {
        return state.goodInfo.categoryView || {};
    },
    skuInfo(state) {
        return state.goodInfo.skuInfo || {};
    },
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || [];
    },
};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}