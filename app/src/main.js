import Vue from 'vue';
import App from './App.vue';

// 三级联动
import TypeNav from "@/components/TypeNav";
// 轮播图
import Carousel from "@/components/Carousel";
// 分页器
import Pagination from "@/components/Pagination";

import router from "@/router";
import store from "@/store";

// mock 模拟数据
import "@/mock/mockServe";

// 统一接口
// import * as API from "@/api";
// Vue.prototype.$API = API;

// swiper 样式
import "swiper/css/swiper.css";

// element-ui
import { MessageBox } from "element-ui";

// 懒加载
import VueLazyload from "vue-lazyload";
import loading from "@/assets/images/loading.gif";

// 表单验证
import "@/plugins/validate";

// 全局组件
Vue.component(TypeNav.name, TypeNav);
Vue.component(Carousel.name, Carousel);
Vue.component(Pagination.name, Pagination);

// element-ui
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 懒加载
Vue.use(VueLazyload, {
  loading
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount('#app')
