// 二次封装 axios
import axios from "axios";

import nprogress from "nprogress";
import "nprogress/nprogress.css";

let instanceAxios = axios.create({
    baseURL: "/dev-mock",
    timeout: 10000
})

// 请求拦截器
instanceAxios.interceptors.request.use((config) => {
    nprogress.start();
    return config;
}, (err) => {
    return Promise.reject(err);
})

// 响应拦截器
instanceAxios.interceptors.response.use((res) => {
    nprogress.done();
    return res.data;
}, (err) => {
    let message = "";
    if (err && err.response) {
        switch (err.response.status) {
            case 302:
                message = "接口重定向！";
                break;
            case 400:
                message = "参数不正确！";
                break;
            case 401:
                message = "您未登录，或者登录已经超时，请先登录！";
                break;
            case 403:
                message = "您没有权限操作！";
                break;
            case 404:
                message = `请求地址出错: ${err.response.config.url}`;
                break;
            case 408:
                message = "请求超时！";
                break;
            case 409:
                message = "系统已存在相同数据！";
                break;
            case 500:
                message = "服务器内部错误！";
                break;
            case 501:
                message = "服务未实现！";
                break;
            case 502:
                message = "网关错误！";
                break;
            case 503:
                message = "服务不可用！";
                break;
            case 504:
                message = "服务暂时无法访问，请稍后再试！";
                break;
            case 505:
                message = "HTTP 版本不受支持！";
                break;
            default:
                message = "异常问题，请联系管理员！";
                break;
        }
    }
    return Promise.reject(message);
})


export default instanceAxios;
