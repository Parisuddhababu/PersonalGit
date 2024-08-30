export const secondsToTime = (e) => {
    const h = Math.floor(e / 3600)
        .toString()
        .padStart(2, '0'),
        m = Math.floor((e % 3600) / 60)
            .toString()
            .padStart(2, '0'),
        s = Math.floor(e % 60)
            .toString()
            .padStart(2, '0');
    if (e <= -1) {
        return '00:00';
    }
    return h !== '00' ? h + ':' : +m + ':' + s;
};

export const convertDataURLtoFile = (dataurl) => {
    const fileName = `recording_thumbnail_${new Date().getTime()}.png`;
    const arrSplit = dataurl.split(',');
    const mime = arrSplit[0].split(':')[1].split(';')[0];
    const bstr = window.atob(arrSplit[arrSplit.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}