import { reqGetCode, reqUserRegister, reqUserLogin, reqGetUserInfo, reqUserLogout } from "@/api";

import { getToken, setToken, removeToken } from "@/utils/token";

const state = {
    code: "",
    token: getToken(),
    userInfo: {}
};

const actions = {
    async getCode(context, value) {
        const result = await reqGetCode(value.phone);
        if (result.code == 200) {
            context.commit("GETCODE", result.data);
            return Promise.resolve("ok");
        } else
            return Promise.reject(new Error(result.message));
    },
    async userRegister(context, value) {
        const result = await reqUserRegister(value);
        if (result.code == 200)
            return Promise.resolve("ok");
        else
            return Promise.reject(new Error(result.message));
    },
    async userLogin(context, value) {
        const result = await reqUserLogin(value);
        if (result.code == 200) {
            setToken(result.data.token);
            context.commit("USERLOGIN", result.data.token);
            return Promise.resolve("ok");
        }
        else
            return Promise.reject(new Error(result.message));
    },
    async getUserInfo(context, value) {
        const result = await reqGetUserInfo();
        if (result.code == 200) {
            context.commit("GETUSERINFO", result.data);
            return Promise.resolve("ok");
        } else
            return Promise.reject(new Error(result.message));
    },
    async userLogout(context, value) {
        const result = await reqUserLogout();
        if (result.code == 200) {
            context.commit("CLEAR", result.data);
            return Promise.resolve("ok");
        }
        else
            return Promise.reject(new Error(result.message));
    },
};

const mutations = {
    GETCODE(state, value) {
        state.code = value;
    },
    USERLOGIN(state, value) {
        state.token = value;
    },
    GETUSERINFO(state, value) {
        state.userInfo = value;
    },
    CLEAR(state, value) {
        state.token = "";
        state.userInfo = {};
        removeToken();
    }
};

const getters = {
    userName(state) {
        return state.userInfo.name || "";
    }
};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}