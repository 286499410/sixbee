'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tool = require('../instance/tool');

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xlsx = function () {
    function xlsx() {
        (0, _classCallCheck3.default)(this, xlsx);
        this.style = {
            font: { name: "微软雅黑", sz: 10 }
        };
        this.titleStyle = {
            alignment: { horizontal: "center", vertical: "center" },
            font: { sz: 16 }
        };
        this.subTitleStyle = {
            font: { sz: 12 },
            alignment: { horizontal: "left", vertical: "center" },
            border: { right: { color: { rgb: "FF000000" } } }
        };
        this.moneyStyle = {
            numFmt: '#,##0.00'
        };
        this.tableStyle = {
            alignment: {
                horizontal: "right",
                vertical: "center"
            },
            border: {
                top: { style: 'thin', color: "FF000000" },
                bottom: { style: 'thin', color: "FF000000" },
                left: { style: 'thin', color: "FF000000" },
                right: { style: 'thin', color: "FF000000" }
            }
        };
        this.tableHeaderStyle = {
            alignment: { horizontal: "center", vertical: "center" },
            font: { sz: 12 },
            fill: {
                fgColor: { rgb: "FFCCCCCC" }
            },
            border: {
                top: { style: 'thin', color: "FF000000" },
                bottom: { style: 'thin', color: "FF000000" },
                left: { style: 'thin', color: "FF000000" },
                right: { style: 'thin', color: "FF000000" }
            }
        };

        this.getMoneyStyle = function (column) {
            var float = parseInt((_lodash2.default.isFunction(column.float) ? column.float() : column.float) || 2);
            return {
                numFmt: '#,##0.'.padEnd(float + 6, '0')
            };
        };
    }

    (0, _createClass3.default)(xlsx, [{
        key: 'getValue',
        value: function getValue(column, data) {
            var value = void 0;
            if (column.exportRender) {
                value = column.exportRender(data, column);
            } else {
                value = column.render ? column.render(data, undefined, column) : _tool2.default.render(data, column, '');
            }
            return value === undefined || value === null ? '' : value;
        }
    }, {
        key: 'handleTableHeader',
        value: function handleTableHeader(sheet, row, col) {
            var _this = this;

            var cols = [],
                merges = [],
                dataKeys = [];
            var cell = {},
                line = 0;

            var handleColumnsCols = function handleColumnsCols(columns) {
                var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                line = Math.max(level, 1);
                var cols = 0;
                columns.map(function (column) {
                    if (column.children && column.children.length > 0) {
                        column.cols = handleColumnsCols(column.children, level + 1);
                    } else {
                        column.cols = 1;
                    }
                    cols += column.cols;
                });
                return cols;
            };
            handleColumnsCols(sheet.columns);
            var handleColumnsRows = function handleColumnsRows(columns) {
                var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                columns.map(function (column) {
                    column.rows = 1;
                    if (column.children && column.children.length > 0) {
                        handleColumnsRows(column.children, level + 1);
                    } else {
                        column.rows = line - level + 1;
                    }
                });
            };
            handleColumnsRows(sheet.columns);

            var handleColumnCell = function handleColumnCell(columns, startCol) {
                var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

                columns.map(function (column) {
                    if (column.exportIgnore) {
                        return;
                    }
                    cell[_this.getCellSymbol(row + level - 1, startCol)] = {
                        v: column.label, s: _lodash2.default.merge({}, _this.style, _this.tableStyle, _this.tableHeaderStyle, {
                            alignment: {
                                horizontal: "center",
                                vertical: "center"
                            }
                        })
                    };
                    if (sheet.columnWidths && sheet.columnWidths[column.key]) {
                        cols.push({ wpx: sheet.columnWidths[column.key] });
                    }
                    if (column.cols > 1 || column.rows > 1) {
                        merges.push({
                            s: { c: startCol, r: row + level - 1 },
                            e: { c: startCol + column.cols - 1, r: row + level - 1 + column.rows - 1 }
                        });

                        for (var i = 0; i < column.cols; i++) {
                            for (var j = 0; j < column.rows; j++) {
                                var originCell = cell[_this.getCellSymbol(row + level - 1 + j, startCol + i)] || {};
                                cell[_this.getCellSymbol(row + level - 1 + j, startCol + i)] = _lodash2.default.merge({
                                    v: '', s: _lodash2.default.merge({}, _this.style, _this.tableStyle, {
                                        alignment: {
                                            horizontal: "center",
                                            vertical: "center"
                                        }
                                    })
                                }, originCell);
                            }
                        }
                    }
                    if (column.children && column.children.length > 0) {
                        handleColumnCell(column.children, startCol, level + 1);
                    } else {
                        dataKeys.push(column);
                    }
                    startCol += column.cols;
                });
            };
            handleColumnCell(sheet.columns, col);

            return {
                cell: cell,
                line: line,
                cols: cols,
                merges: merges,
                dataKeys: dataKeys
            };
        }
    }, {
        key: 'export',
        value: function _export(data) {
            var _this2 = this;

            var fileName = data.filename + '_' + _tool2.default.date('Y-m-d');
            var sheets = [],
                sheetNames = [];
            data.sheets.map(function (sheet, index) {
                var row = 0;
                sheetNames.push(sheet.name);
                if (sheet.title) {
                    row++;
                }
                if (sheet.subTitle) {
                    row += sheet.subTitle.length;
                }

                var _handleTableHeader = _this2.handleTableHeader(sheet, row, 0),
                    cell = _handleTableHeader.cell,
                    line = _handleTableHeader.line,
                    cols = _handleTableHeader.cols,
                    merges = _handleTableHeader.merges,
                    dataKeys = _handleTableHeader.dataKeys;

                if (sheet.title) {
                    cell[_this2.getCellSymbol(0, 0)] = { v: sheet.title, s: _lodash2.default.merge({}, _this2.style, _this2.titleStyle) };
                    merges.push({
                        s: { c: 0, r: 0 },
                        e: { c: dataKeys.length - 1, r: 0 }
                    });
                }
                if (sheet.subTitle) {
                    sheet.subTitle.map(function (row, i) {
                        var v = '';
                        if (_lodash2.default.isObject(row)) {
                            v = row.value;
                        } else {
                            v = row;
                        }
                        cell[_this2.getCellSymbol(i + 1, 0)] = {
                            v: v,
                            s: _lodash2.default.merge({}, _this2.style, _this2.subTitleStyle, {
                                alignment: {
                                    horizontal: row.textAlign || "left",
                                    vertical: "center"
                                }
                            })
                        };
                        merges.push({
                            s: { c: 0, r: i + 1 },
                            e: { c: dataKeys.length - 1, r: i + 1 }
                        });
                    });
                }
                row += line;
                sheet.data.map(function (data, i) {
                    var groupRow = 1;
                    dataKeys.map(function (dataKey, j) {
                        if (dataKey.groupKey) {
                            var groupData = _lodash2.default.get(data, dataKey.groupKey) || [];
                            groupRow = groupData.length;
                        }
                    });
                    dataKeys.map(function (dataKey, j) {
                        if (dataKey.groupKey) {
                            var groupData = _lodash2.default.get(data, dataKey.groupKey) || [];
                            groupData.map(function (detail, k) {
                                var cellSymbol = _this2.getCellSymbol(row + i + k, j);
                                cell[cellSymbol] = {
                                    v: _this2.getValue(dataKey, detail),
                                    s: _lodash2.default.merge({}, _this2.style, _this2.tableStyle, {
                                        alignment: {
                                            horizontal: dataKey.textAlign || "left",
                                            vertical: "center"
                                        }
                                    }, dataKey.type === 'money' ? _this2.getMoneyStyle(dataKey) : {})
                                };
                            });
                        } else {
                            var cellSymbol = _this2.getCellSymbol(row + i, j);
                            cell[cellSymbol] = {
                                v: _this2.getValue(dataKey, data),
                                s: _lodash2.default.merge({}, _this2.style, _this2.tableStyle, {
                                    alignment: {
                                        horizontal: dataKey.textAlign || "left",
                                        vertical: "center"
                                    }
                                }, dataKey.type === 'money' ? _this2.getMoneyStyle(dataKey) : {})
                            };
                            var extend = _lodash2.default.get(data, 'extend.' + dataKey.key);
                            if (extend) {
                                cell[cellSymbol] = _lodash2.default.merge({}, cell[cellSymbol], extend);
                            }
                            if (groupRow > 1) {
                                merges.push({
                                    s: { c: j, r: row + i },
                                    e: { c: j, r: row + i + groupRow - 1 }
                                });
                                for (var s = 1; s < groupRow; s++) {
                                    var _cellSymbol = _this2.getCellSymbol(row + i + s, j);
                                    cell[_cellSymbol] = {
                                        s: _lodash2.default.merge({}, _this2.style, _this2.tableStyle, {
                                            alignment: {
                                                horizontal: dataKey.textAlign || "left",
                                                vertical: "center"
                                            }
                                        }, dataKey.type === 'money' ? _this2.getMoneyStyle(dataKey) : {})
                                    };
                                }
                            }
                        }
                    });
                    row += groupRow - 1;
                });
                row += sheet.data.length;

                if (sheet.footerData) {
                    sheet.footerData[0].map(function (data, i) {
                        cell[_this2.getCellSymbol(row, i)] = {
                            v: data.content || '',
                            s: _lodash2.default.merge({}, _this2.style, _this2.tableStyle, {
                                alignment: {
                                    horizontal: data.textAlign || "left",
                                    vertical: "center"
                                }
                            }, data.type === 'money' ? _this2.moneyStyle : {})
                        };
                    });
                }

                var keys = (0, _keys2.default)(cell);
                sheets[sheet.name] = (0, _extends3.default)({
                    '!cols': cols,
                    '!merges': merges,
                    '!ref': 'A1:' + _lodash2.default.last(keys)
                }, cell);
            });

            var workbook = {
                SheetNames: sheetNames,
                Sheets: sheets
            };

            var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
            var wbout = XLSX.write(workbook, wopts);
            this.saveAs(new Blob([this.s2ab(wbout)], { type: "" }), fileName + ".xlsx");
        }
    }, {
        key: 'getCellSymbol',
        value: function getCellSymbol(row, col) {
            var s = '',
                m = 0;
            while (col >= 0) {
                m = col % 26 + 1;
                s = String.fromCharCode(m + 64) + s;
                col = (col - m) / 26;
            }
            return s + (row + 1).toString();
        }
    }, {
        key: 's2ab',
        value: function s2ab(s) {
            if (typeof ArrayBuffer !== 'undefined') {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }return buf;
            } else {
                var _buf = new Array(s.length);
                for (var _i = 0; _i != s.length; ++_i) {
                    _buf[_i] = s.charCodeAt(_i) & 0xFF;
                }return _buf;
            }
        }
    }, {
        key: 'saveAs',
        value: function saveAs(obj, fileName) {
            var tmpa = document.createElement("a");
            tmpa.download = fileName || this.state.filename;
            tmpa.href = URL.createObjectURL(obj);
            tmpa.click();
            setTimeout(function () {
                URL.revokeObjectURL(obj);
            }, 100);
        }
    }]);
    return xlsx;
}();

exports.default = xlsx;