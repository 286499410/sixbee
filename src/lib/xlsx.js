/**
 * Created by zhengzhaowei on 2018/7/31.
 */
import _ from 'lodash';
import utils from '../instance/tool';

export default class xlsx {

    style = {
        font: {name: "微软雅黑", sz: 10}
    };

    titleStyle = {
        alignment: {horizontal: "center", vertical: "center"},
        font: {sz: 16}
    };

    subTitleStyle = {
        font: {sz: 12},
        alignment: {horizontal: "left", vertical: "center"},
        border: {right: {color: {rgb: "FF000000"}}}
    };

    moneyStyle = {
        numFmt: '#,##0.00',
    };

    tableStyle = {
        alignment: {
            horizontal: "right",
            vertical: "center"
        },
        border: {
            top: {style: 'thin', color: "FF000000"},
            bottom: {style: 'thin', color: "FF000000"},
            left: {style: 'thin', color: "FF000000"},
            right: {style: 'thin', color: "FF000000"}
        }
    };

    tableHeaderStyle = {
        alignment: {horizontal: "center", vertical: "center"},
        font: {sz: 12},
        fill: {
            fgColor: {rgb: "FFCCCCCC"}
        },
        border: {
            top: {style: 'thin', color: "FF000000"},
            bottom: {style: 'thin', color: "FF000000"},
            left: {style: 'thin', color: "FF000000"},
            right: {style: 'thin', color: "FF000000"}
        }
    };


    getValue(column, data) {
        let value;
        if (column.exportRender) {
            value = column.exportRender(data, column);
        } else {
            value = column.render ? column.render(data, undefined, column) : utils.render(data, column, '');
        }
        return value === undefined || value === null ? '' : value;
    }


    handleTableHeader(sheet, row, col) {
        //处理列和表格头部
        let cols = [], merges = [], dataKeys = [];
        let cell = {}, line = 0;
        //计算每个字段占用列数，用于合并单元格
        let handleColumnsCols = (columns, level = 1) => {
            line = Math.max(level, 1);
            let cols = 0;
            columns.map(column => {
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
        let handleColumnsRows = (columns, level = 1) => {
            columns.map(column => {
                column.rows = 1;
                if (column.children && column.children.length > 0) {
                    handleColumnsRows(column.children, level + 1);
                } else {
                    column.rows = line - level + 1;
                }
            });
        };
        handleColumnsRows(sheet.columns);

        //处理列单元格数据
        let handleColumnCell = (columns, startCol, level = 1) => {
            columns.map(column => {
                if(column.exportIgnore) {
                    return;
                }
                cell[this.getCellSymbol(row + level - 1, startCol)] = {
                    v: column.label, s: _.merge({}, this.style, this.tableStyle, this.tableHeaderStyle, {
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        }
                    })
                };
                if (sheet.columnWidths && sheet.columnWidths[column.key]) {
                    cols.push({wpx: sheet.columnWidths[column.key]});
                }
                if (column.cols > 1 || column.rows > 1) {
                    //单元格合并
                    merges.push({
                        s: {c: startCol, r: row + level - 1},
                        e: {c: startCol + column.cols - 1, r: row + level - 1 + column.rows - 1}
                    });
                    //设置合并的单元格样式
                    for (let i = 0; i < column.cols; i++) {
                        for (let j = 0; j < column.rows; j++) {
                            let originCell = cell[this.getCellSymbol(row + level - 1 + j, startCol + i)] || {};
                            cell[this.getCellSymbol(row + level - 1 + j, startCol + i)] = _.merge({
                                v: '', s: _.merge({}, this.style, this.tableStyle, {
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
            cell: cell, //单元格数值
            line: line, //占用行数
            cols: cols, //列宽度
            merges: merges, //合并单元格
            dataKeys: dataKeys
        }
    }

    getMoneyStyle = (column) => {
        let float = parseInt((_.isFunction(column.float) ? column.float() : column.float) || 2);
        return {
            numFmt: '#,##0.'.padEnd(float + 6, '0'),
        }
    };

    export(data) {
        let fileName = data.filename + '_' + utils.date('Y-m-d');
        let sheets = [], sheetNames = [];
        data.sheets.map((sheet, index) => {
            let row = 0;
            sheetNames.push(sheet.name);
            if (sheet.title) {
                row++;
            }
            if (sheet.subTitle) {
                row += sheet.subTitle.length;
            }
            let {cell, line, cols, merges, dataKeys} = this.handleTableHeader(sheet, row, 0);
            if (sheet.title) {
                cell[this.getCellSymbol(0, 0)] = {v: sheet.title, s: _.merge({}, this.style, this.titleStyle)};
                merges.push({
                    s: {c: 0, r: 0},
                    e: {c: dataKeys.length - 1, r: 0}
                });
            }
            if (sheet.subTitle) {
                sheet.subTitle.map((row, i) => {
                    let v = '';
                    if (_.isObject(row)) {
                        v = row.value;
                    } else {
                        v = row;
                    }
                    cell[this.getCellSymbol(i + 1, 0)] = {
                        v: v,
                        s: _.merge({}, this.style, this.subTitleStyle, {
                            alignment: {
                                horizontal: row.textAlign || "left",
                                vertical: "center"
                            }
                        })
                    };
                    merges.push({
                        s: {c: 0, r: i + 1},
                        e: {c: dataKeys.length - 1, r: i + 1}
                    });
                });
            }
            row += line;
            sheet.data.map((data, i) => {
                let groupRow = 1;
                dataKeys.map((dataKey, j) => {
                    if(dataKey.groupKey) {
                        let groupData = (_.get(data, dataKey.groupKey) || []);
                        groupRow = groupData.length;
                    }
                });
                dataKeys.map((dataKey, j) => {
                    if(dataKey.groupKey) {
                        let groupData = (_.get(data, dataKey.groupKey) || []);
                        groupData.map((detail, k) => {
                            let cellSymbol = this.getCellSymbol(row + i + k, j);
                            cell[cellSymbol] = {
                                v: this.getValue(dataKey, detail),
                                s: _.merge({}, this.style, this.tableStyle, {
                                    alignment: {
                                        horizontal: dataKey.textAlign || "left",
                                        vertical: "center"
                                    }
                                }, (dataKey.type === 'money' ? this.getMoneyStyle(dataKey) : {})),
                            };
                        });
                    } else {
                        let cellSymbol = this.getCellSymbol(row + i, j);
                        cell[cellSymbol] = {
                            v: this.getValue(dataKey, data),
                            s: _.merge({}, this.style, this.tableStyle, {
                                alignment: {
                                    horizontal: dataKey.textAlign || "left",
                                    vertical: "center"
                                }
                            }, (dataKey.type === 'money' ? this.getMoneyStyle(dataKey) : {})),
                        };
                        let extend = _.get(data, `extend.${dataKey.key}`);
                        if (extend) {
                            cell[cellSymbol] = _.merge({}, cell[cellSymbol], extend);
                        }
                        if(groupRow > 1) {
                            //合并单元格
                            merges.push({
                                s: {c: j, r: row + i},
                                e: {c: j, r: row + i + groupRow - 1}
                            });
                            for(let s = 1; s < groupRow; s++) {
                                let cellSymbol = this.getCellSymbol(row + i + s, j);
                                cell[cellSymbol] = {
                                    s: _.merge({}, this.style, this.tableStyle, {
                                        alignment: {
                                            horizontal: dataKey.textAlign || "left",
                                            vertical: "center"
                                        }
                                    }, (dataKey.type === 'money' ? this.getMoneyStyle(dataKey) : {})),
                                };
                            }
                        }
                    }
                });
                row += groupRow - 1;
            });
            row += sheet.data.length;

            if (sheet.footerData) {
                sheet.footerData[0].map((data, i) => {
                    cell[this.getCellSymbol(row, i)] = {
                        v: data.content || '',
                        s: _.merge({}, this.style, this.tableStyle, {
                            alignment: {
                                horizontal: data.textAlign || "left",
                                vertical: "center"
                            }
                        }, (data.type === 'money' ? this.moneyStyle : {}))
                    };
                });
            }

            let keys = Object.keys(cell);
            sheets[sheet.name] = {
                '!cols': cols,
                '!merges': merges,
                '!ref': 'A1:' + _.last(keys),
                ...cell
            }
        });

        let workbook = {
            SheetNames: sheetNames,
            Sheets: sheets
        };
        //return;
        let wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
        let wbout = XLSX.write(workbook, wopts);
        this.saveAs(new Blob([this.s2ab(wbout)], {type: ""}), fileName + ".xlsx");
    }

    /**
     * 单元格符号
     * @param row
     * @param col
     */
    getCellSymbol(row, col) {
        let s = '', m = 0;
        while (col >= 0) {
            m = col % 26 + 1;
            s = String.fromCharCode(m + 64) + s;
            col = (col - m) / 26
        }
        return s + (row + 1).toString();
    }


    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            let buf = new Array(s.length);
            for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    }

    saveAs(obj, fileName) {
        let tmpa = document.createElement("a");
        tmpa.download = fileName || this.state.filename;
        tmpa.href = URL.createObjectURL(obj);
        tmpa.click();
        setTimeout(function () {
            URL.revokeObjectURL(obj);
        }, 100);
    }
}