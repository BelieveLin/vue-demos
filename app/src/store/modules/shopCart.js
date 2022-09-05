import { reqGetCartList, reqDelCartById, reqUpdateCheckedById } from "@/api";

const state = {
    cartList: []
};

const actions = {
    async getCartList(context, value) {
        const result = await reqGetCartList();
        if (result.code == 200)
            context.commit("GETCARTLIST", result.data);
    },
    async delCartById(context, value) {
        const result = await reqDelCartById(value.skuId);
        if (result.code == 200)
            return Promise.resolve("ok");
        else
            return Promise.reject(new Error(result.message));
    },
    async updateCheckedById(context, value) {
        const result = await reqUpdateCheckedById(value.skuId, value.isChecked);
        if (result.code == 200)
            return Promise.resolve("ok");
        else
            return Promise.reject(new Error(result.message));
    },
    delAllChecked(context, value) {
        let PromiseAll = [];
        context.getters.cartInfo.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? context.dispatch("delCartById", item) : "";
            PromiseAll.push(promise);
        });
        return Promise.all(PromiseAll);
    },
    updateAllChecked(context, value) {
        let PromiseAll = [];
        context.getters.cartInfo.cartInfoList.forEach((item) => {
            let promise = context.dispatch("updateCheckedById", { skuId: item.skuId, isChecked: value.isChecked });
            PromiseAll.push(promise);
        });
        return Promise.all(PromiseAll);
    }

};

const mutations = {
    GETCARTLIST(state, value) {
        state.cartList = value;
    }
};

const getters = {
    cartInfo(state) {
        return state.cartList[0] || {};
    },
};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}