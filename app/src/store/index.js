import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

import home from "./modules/home";
import search from "./modules/search";
import detail from "./modules/detail";
import shopCart from "./modules/shopCart";
import user from "./modules/user";
import trade from "./modules/trade";
import pay from "./modules/pay";
import order from "./modules/order";


export default new Vuex.Store({
    modules: {
        home,
        search,
        detail,
        shopCart,
        user,
        trade,
        pay,
        order
    }
})