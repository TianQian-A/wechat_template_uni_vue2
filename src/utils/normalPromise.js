function isPromise(obj) {
    return (
        !!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function"
    );
}
// uni-app 部分的 API 支持 Promise，但是返回格式不一致，使其返回标准的 Promise 格式
uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) {
            return res;
        }
        return new Promise((resolve, reject) => {
            res.then((res) => {
                if (res[0]) {
                    reject(res[0]);
                } else {
                    resolve(res[1]);
                }
            });
        });
    },
});