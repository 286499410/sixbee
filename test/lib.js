const assert = require('assert');

let App = require('../dist').default;

describe('#tool.js', () => {
    describe('#date()', () => {
        let date = App.lib('tool').date;
        it("date('Y-m-d H:i:s', 1547186290) should return 2019-01-11 13:58:10", () => {
            assert.strictEqual(date('Y-m-d H:i:s', 1547186290), '2019-01-11 13:58:10');
        });
        it("date('Y-m-d H:i', 1547186290) should return 2019-01-11 13:58", () => {
            assert.strictEqual(date('Y-m-d H:i', 1547186290), '2019-01-11 13:58');
        });
        it("date('Y-m-d', 1547186290) should return 2019-01-11", () => {
            assert.strictEqual(date('Y-m-d', 1547186290), '2019-01-11');
        });
        it("date('Y-m', 1547186290) should return 2019-01", () => {
            assert.strictEqual(date('Y-m', 1547186290), '2019-01');
        });
        it("date('Y', 1547186290) should return 2019", () => {
            assert.strictEqual(date('Y', 1547186290), '2019');
        });
        it("date('H:i:s', 1547186290) should return 13:58:10", () => {
            assert.strictEqual(date('H:i:s', 1547186290), '13:58:10');
        });
        it("date('H:i', 1547186290) should return 13:58", () => {
            assert.strictEqual(date('H:i', 1547186290), '13:58');
        });
    });
});

describe('#object.js', () => {
    let object = App.lib('object');
    it("object.isEmpty(null) should return true", () => {
        assert.strictEqual(object.isEmpty(null), true);
    });
    it("object.isEmpty(undefined) should return true", () => {
        assert.strictEqual(object.isEmpty(undefined), true);
    });
    it("object.isEmpty('') should return true", () => {
        assert.strictEqual(object.isEmpty(''), true);
    });
    it("object.isNull(null) should return true", () => {
        assert.strictEqual(object.isNull(null), true);
    });
    it("object.type(1) should return number", () => {
        assert.strictEqual(object.type(1), 'number');
    });
    it("object.type(false) should return boolean", () => {
        assert.strictEqual(object.type(false), 'boolean');
    });
    it("object.type('joey') should return string", () => {
        assert.strictEqual(object.type('joey'), 'string');
    });
    it("object.type([]) should return array", () => {
        assert.strictEqual(object.type([]), 'array');
    });
});

describe('#validate.js', () => {
    let validate = App.lib('validate');
    it("validate.isEmail('2864@') should return false", () => {
        assert.strictEqual(validate.isEmail('2864@'), false);
    });
    it("validate.isEmail('2864@qq.com') should return true", () => {
        assert.strictEqual(validate.isEmail('2864@qq.com'), true);
    });
    it("validate.isMobile('286499') should return false", () => {
        assert.strictEqual(validate.isMobile('286499'), false);
    });
    it("validate.isMobile('13580646909') should return true", () => {
        assert.strictEqual(validate.isMobile('13580646909'), true);
    });
    it("validate.isUrl('httsffsdf') should return false", () => {
        assert.strictEqual(validate.isUrl('httsffsdf'), false);
    });
    it("validate.isUrl('https://www.baidu.com') should return true", () => {
        assert.strictEqual(validate.isUrl('https://www.baidu.com'), true);
    });
    it("validate.isNumber('22d') should return false", () => {
        assert.strictEqual(validate.isNumber('22d'), false);
    });
    it("validate.isNumber('2.20') should return true", () => {
        assert.strictEqual(validate.isNumber(2.20), true);
    });
});


// describe('#request.js', () => {
//     let request = App.lib('request');
//     describe('#get https://www.baidu.com', () => {
//         request.setConfig({dataType: 'html', responseType: 'html'});
//         request.get('https://www.baidu.com').then((res) => {
//             res.text().then((data) => {
//                 assert.strictEqual(data.substr(0, 6), '<html>');
//             });
//         });
//     });
// });
//
// describe('#storage.js', () => {
//     let storage = App.lib('storage');
//     describe('#session', () => {
//         storage.session('user', 'joey');
//         it("storage.session('user') should return joey", () => {
//             assert.strictEqual(storage.session('user'), 'joey');
//         });
//     });
// });