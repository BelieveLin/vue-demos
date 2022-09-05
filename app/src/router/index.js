import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

import store from "@/store";

// 重写 push、replace
const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function push(location, resolve, reject) {
    if (resolve && reject)
        return originPush.call(this, location, resolve, reject);
    else
        return originPush.call(this, location, () => { }, () => { });
}
VueRouter.prototype.replace = function replace(location, resolve, reject) {
    if (resolve && reject)
        return originReplace.call(this, location, resolve, reject);
    else
        return originReplace.call(this, location, () => { }, () => { });
}


Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    },
});


router.beforeEach(async (to, from, next) => {
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    // 已登录且在线
    if (token && navigator.onLine) {
        // 登陆页面
        if (to.path == "/login")
            next(false);
        // 其它页面
        else {
            // 有用户名
            if (name)
                next();
            // 没有用户名
            else {
                // 获取成功
                try {
                    await store.dispatch("user/getUserInfo");
                    next();
                    // 获取失败（token过期）
                } catch (err) {
                    alert("token失效");
                    try {
                        await store.dispatch("user/userLogout");
                    } catch (err) {
                    } finally {
                        next("/login");
                    }
                }
            }
        }
        // 未登录
    } else {
        let permissionPaths = ["/center"];
        let illegalPaths = ["/trade", "/addcartsuccess", "/pay", "/paysuccess"];
        let checkPaths = [...permissionPaths, ...illegalPaths];
        if (checkPaths.some(item => to.path.indexOf(item) != -1)) {
            alert("请登录账号");
            let toPath = to.path;
            if (illegalPaths.some(item => to.path.indexOf(item) != -1))
                toPath = "/home";
            next(`/login?redirect=${toPath}`);
        }
        else
            next();
    }
});


export default router;


