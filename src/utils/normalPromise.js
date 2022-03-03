function isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) {
            return res
        }
        const returnValue = [undefined, undefined]
        return res
            .then((res) => {
                returnValue[1] = res
            })
            .catch((err) => {
                returnValue[0] = err
            })
            .then(() => returnValue)
    }
})