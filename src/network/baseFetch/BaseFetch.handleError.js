export const handleError = async (errorToast, { msg, code } = data) => {
    if (errorToast) {
        await uni.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        });
    }
    throw data;
}