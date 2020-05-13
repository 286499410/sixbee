/**
 * Created by zhengzhaowei on 2017/9/7.
 */
import _ from 'lodash';
import request from '../instance/request';
const GET = 'get';
const POST = 'post';
const PUT = 'put';
const DELETE = 'delete';

export default class Curd {

    uri;
    api = {
        create: {
            method: POST
        },
        read: {
            method: GET
        },
        single: {
            method: GET
        },
        update: {
            method: PUT
        },
        delete: {
            method: DELETE
        },
        list: {
            method: GET
        }
    };

    config = {
        headers: {}
    };

    constructor(key) {
        this.uri = '/' + key.replace('.', '/');
        Object.keys(this.api).map((key) => {
            this.api[key].uri = this.uri;
        });
    }

    /**
     * 设置配置数据
     * @param config
     */
    setConfig(config) {
        Object.assign(this.config, config);
        return this;
    }

    getHeader() {
        return this.config.headers;
    }

    /**
     * 设置报头
     * @param header
     */
    setHeader(header) {
        Object.assign(this.config.headers, header);
        return this;
    }

    create(data) {
        return new Promise((resolve, reject) => {
            request[this.api.create.method](this.api.create.uri, data, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    })
                } else {
                    reject(res);
                }
            });
        });
    }

    read(id, params) {
        return new Promise((resolve, reject) => {
            request[this.api.read.method](this.api.read.uri + '/' + id, params, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    });
                } else {
                    reject(res);
                }
            })
        });
    }

    single(params) {
        return new Promise((resolve, reject) => {
            request[this.api.single.method](this.api.single.uri, params, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    })
                } else {
                    reject(res);
                }
            })
        });
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            request[this.api.update.method](this.api.update.uri + '/' + id, data, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    })
                } else {
                    reject(res);
                }
            })
        });
    }

    delete(ids) {
        if (_.isArray(ids)) {
            ids = ids.join(',');
        }
        return new Promise((resolve, reject) => {
            request[this.api.delete.method](this.api.delete.uri + '/' + ids, {}, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    })
                } else {
                    reject(res);
                }
            })
        });
    }

    list(params) {
        return new Promise((resolve, reject) => {
            request[this.api.list.method](this.api.list.uri, params, {...request.getHeader(), ...this.getHeader()}).then((res) => {
                if (res.ok) {
                    res.json().then((json) => {
                        resolve(json);
                    })
                } else {
                    reject(res);
                }
            })
        });
    }

}

