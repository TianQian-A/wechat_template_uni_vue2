import BaseFetch from "@/network/baseFetch/BaseFetch";
export class User extends BaseFetch {
    /**
     * 请求 User 相关接口
     */
    constructor() {
        super();
        // 可配置该接口统一的 errorToast 和 header
        this.options = options || {};
    }
    getUserInfo(data = {}, options = {}) {
        return this.post('/getUserInfo', data, { ...this.options, ...options})
    }
}