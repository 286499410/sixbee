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

    constructor(key) {
        this.uri = '/' + key.replace('.', '/');
        Object.keys(this.api).map((key) => {
            this.api[key].uri = this.uri;
        });
    }

    create(data) {
        return new Promise((resolve, reject) => {
            request[this.api.create.method](this.api.create.uri, data).then((res) => {
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
            request[this.api.read.method](this.api.read.uri + '/' + id, params).then((res) => {
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
            request[this.api.single.method](this.api.single.uri, params).then((res) => {
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
            request[this.api.update.method](this.api.update.uri + '/' + id, data).then((res) => {
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
            request[this.api.delete.method](this.api.delete.uri + '/' + ids, {}).then((res) => {
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
            request[this.api.list.method](this.api.list.uri, params).then((res) => {
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

