/**
 * Created by zhengzhaowei on 2017/9/7.
 */

export default class validate {

    constructor() {

    }

    isEmail(value) {
        let reg = /^[A-Za-z0-9._-\u4e00-\u9fff]+@[a-zA-Z0-9_-\u4e00-\u9fff]+(\.[a-zA-Z0-9_-\u4e00-\u9fff]+)+$/;
        return reg.test(value);
    }

    isMobile(value) {
        let reg = /^\d{11}$/;
        return reg.test(value);
    }

    isUrl(value) {
        let reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return reg.test(value);
    }

    isIp(value) {
        let reg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;
        return reg.test(value);
    }

    isInteger(value) {
        let reg = /^\d+$/;
        return reg.test(value);
    }

    isNumber(value) {
        let reg = /^\d+(\.\d+)?$/;
        return reg.test(value);
    }


    cmpDateTime(datetime1, datetime2) {
        let diff = new Date(Date.parse(datetime1)).getTime() - new Date(Date.parse(datetime2)).getTime();
        if(diff > 0) {
            return 1;
        } else if(diff == 0) {
            return 0;
        } else {
            return -1;
        }
    }

}
