export default [
    {
        path: '/home',
        component: () => import('@/pages/Home'),
        meta: {
            isFooterShow: true
        }
    },
    {
        name: "search",
        path: '/search/:keyword?',
        component: () => import('@/pages/Search'),
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/detail/:skuid',
        component: () => import('@/pages/Detail'),
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        beforeEnter(to, from, next) {
            if (from.path.indexOf("/detail") != -1 && to.query.skuNum && sessionStorage.getItem("SKUINFO"))
                next();
            else if (from.path == "/login")
                next("/home");
            else
                next(false);
        },
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/trade',
        component: () => import('@/pages/Trade'),
        beforeEnter(to, from, next) {
            if (from.path == "/shopcart" || (from.path == "/" && to.path == "/trade" && window.performance.navigation.type == 1))
                next();
            else if (from.path == "/" || from.path == "/login")
                next("/home");
            else
                next(false);
        },
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/pay',
        component: () => import('@/pages/Pay'),
        beforeEnter(to, from, next) {
            if (from.path == "/trade" || (from.path == "/" && to.path == "/pay" && window.performance.navigation.type == 1))
                next();
            else if (from.path == "/" || from.path == "/login")
                next("/home");
            else
                next(false);
        },
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        beforeEnter(to, from, next) {
            if (from.path == "/pay" || (from.path == "/" && to.path == "/paysuccess" && window.performance.navigation.type == 1))
                next();
            else if (from.path == "/" || from.path == "/login")
                next("/home");
            else
                next(false);
        },
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        redirect: "/center/myorder",
        children: [
            {
                path: 'myorder',
                component: () => import('@/pages/Center/MyOrder'),
            },
            {
                path: 'grouporder',
                component: () => import('@/pages/Center/GroupOrder'),
            }
        ],
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/login',
        component: () => import('@/pages/Login')
    },
    {
        path: '/register',
        component: () => import('@/pages/Register')
    },
    {
        path: '*',
        redirect: '/home'
    },
]