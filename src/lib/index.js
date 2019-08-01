import request from '../instance/request';
import storage from '../instance/storage';
import tool from '../instance/tool';
import object from '../instance/object';
import validate from '../instance/validate';
import xlsx from '../instance/xlsx';

let libs = {
    request: request,
    storage: storage,
    tool: tool,
    object: object,
    validate: validate,
    xlsx: xlsx
};

export default (name) => {
    return libs[name];
}