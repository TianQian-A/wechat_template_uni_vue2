export const handleResponse = (response) => {
    return new Promise((resolve, reject) => {
        if (response.statusCode >= 200 && response.status < 300) {
            let responseData = response.data;
            if (responseData.code !== 0) reject({code: responseData.code, msg: responseData.msg})
            else resolve(responseData);
        } else {
            reject({ code: response.statusCode, msg: '请求错误' });
        }
    });
};