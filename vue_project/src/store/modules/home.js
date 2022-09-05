import { reqGetEchartsList } from "@/api/dashboard"

const state = {
    info: JSON.parse(sessionStorage.getItem("echartData")) || {}
}

const actions = {
    async getData(context, value) {
        const result = await reqGetEchartsList();
        if (result.code == 200) {
            sessionStorage.setItem("echartData", JSON.stringify(result.data))
            context.commit("GETDATA", result.data);
        }

    }
}

const mutations = {
    GETDATA(state, value) {
        state.info = value;
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}