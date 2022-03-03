import { handleError } from "@/network/baseFetch/BaseFetch.handleError";
import { handleResponse } from "@/network/baseFetch/BaseFetch.handleResponse";
export default class BaseFetch {
    constructor() {}
    static _Config = {
        printLog: process.env.NODE_ENV !== 'production', // 是否控制台打印请求信息
        errorToast: true, // 错误时是否弹窗
    }
    // 在控制台打印信息
    static _PrintInfo(url, ...args) {
        if (BaseFetch._Config.printLog) {
            console.log(`[BaseFetch: ${url}] [${new Date().toLocaleString()}] `, ...args)
        }
    }
    // 判断类型
    static _ToType(obj) {
        return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
    // 过滤 data 空值
    static _FilterEmpty(data) {
        if (BaseFetch._ToType(data) !== 'object') return data;
        let newData = {};
        for (let key in data) {
            let type = BaseFetch._ToType(data[key]);
            if (type === "string") newData[key] = data[key].trim();
            else if (type !== 'undefined' || type !== 'null') newData[key] = data[key];
        }
        return newData;
    }

    /**
     * 请求函数
     * @param url
     * @param method
     * @param data
     * @param errorToast 是否展示错误弹窗
     * @param header
     * @returns { Promise<Promise> }
     */
    static _Request(url, { method = 'POST', data = {}, errorToast = BaseFetch._Config.errorToast, header = {} } = options) {
        url = url[0] === '/' ? process.env.VUE_APP_BASE_URL + url : url;
        data = BaseFetch._FilterEmpty(data);
        return uni.request({
            url,
            method,
            data,
            header: {
                'content-type': 'application/json',
                code: uni.getStorageSync('code') || '',
                ...header
            },
        })
            .then(response => {
                BaseFetch._PrintInfo(url, '网络响应成功', response);
                return handleResponse(response).then(responseData => {
                    BaseFetch._PrintInfo(url, '请求成功', responseData);
                    return responseData;
                })
            })
            .catch(error => {
                if (!error.hasOwnProperty('code')) error = { code: -1, msg: '网络错误' };
                BaseFetch._PrintInfo(url, error.code === -1 ? '网络错误' : '请求错误', error);
                return handleError(errorToast, error);
            })
    }
    // 判断参数类型是否符合要求
    static _CheckBefore(url, data, options) {
        return new Promise((resolve, reject) => {
            // 判断 url
            if (BaseFetch._ToType(url) !== 'string') return reject(new Error('url must be a string'));
            // 判断 options
            if (BaseFetch._ToType(options) !== 'object') return reject(new Error('options must be a object'));
            // 判断 data
            if (BaseFetch._ToType(data) !== 'object') return reject(new Error('data must be a object'))
            return resolve();
        });
    }

    /**
     * 请求成功返回的必带参数
     * @typedef {Object} requestRes
     * @property {Object} data
     * @property {number} code
     */
    /**
     * post 请求
     * @param url
     * @param data
     * @param {Object} options 可配置请求的 errorToast 和 header,并且可覆盖 method 和 data
     * @returns {Promise.<requestRes>}
     */
    async post(url, data = {}, options = {}) {
        await BaseFetch._CheckBefore(url, data, options);
        return BaseFetch._Request(url, {
            method: 'POST',
            data,
            ...options
        });
    }

    /**
     * get 请求
     * @param url
     * @param data
     * @param {Object} options 可配置请求的 errorToast 和 header,并且可覆盖 method 和 data
     * @returns {Promise.<requestRes>}
     */
    async get(url, data = {}, options = {}) {
        await BaseFetch._CheckBefore(url, data, options);
        return BaseFetch._Request(url, {
            method: 'GET',
            data,
            ...options
        });
    }
}