import { reqUserLogin, reqUserLogout, reqGetUserInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

import router from '@/router'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    // 异步路由
    resultAsyncRoutes: [],
    // 所有路由
    resultAllRoutes: [],
    // 动态添加的路由
    resultAddRoutes: [],
  }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length)
        item.children = computedAsyncRoutes(item.children, routes)
      return true
    }
  })
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO(state, value) {
    state.name = value.name;
    state.avatar = value.avatar;
    // 菜单权限
    state.routes = value.routes;
    // 按钮权限
    state.buttons = value.buttons;
    // 角色
    state.roles = value.roles
  },
  SET_RESULTASYNCROUTES(state, value) {
    state.resultAsyncRoutes = value;
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    state.resultAddRoutes = state.resultAsyncRoutes.concat(anyRoutes);
    router.addRoutes(state.resultAddRoutes);
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await reqUserLogin({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token);
      return Promise.resolve("ok");
    } else
      return Promise.reject(new Error("fail"));
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      reqGetUserInfo({ token: state.token }).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USERINFO', data);
        commit("SET_RESULTASYNCROUTES", computedAsyncRoutes(asyncRoutes, data.routes));
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      reqUserLogout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

