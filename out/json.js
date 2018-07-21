"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toJSON(ctx) {
    let obj = {};
    obj.fields = {};
    for (let field of ctx.schema.fields) {
        obj.fields[field.key] = serializeField(field, ctx.root.fields[field.key], ctx);
    }
    return flatten(obj, ctx);
}
exports.toJSON = toJSON;
function flatten(obj, ctx) {
    if (obj.fields) {
        for (let key in obj.fields) {
            if (typeof obj.fields[key] == 'object') {
                obj.fields[key] = flatten(obj.fields[key], ctx);
                if (obj.fields[key] === undefined)
                    delete obj.fields[key];
            }
        }
        if (Object.keys(obj.fields).length === 0)
            delete obj.fields;
    }
    if (obj.elements) {
        obj.elements = obj.elements.map(e => (typeof e == 'object') ? flatten(e, ctx) : e);
        if (obj.elements.length == 0)
            delete obj.elements;
    }
    if (obj.value != '' && !obj.fields && !obj.elements)
        return obj.value;
    if (obj.value == '' && obj.fields && !obj.elements)
        return obj.fields;
    if (obj.value == '' && !obj.fields && obj.elements)
        return obj.elements;
    if (obj.value != '' && obj.fields && !obj.elements)
        return Object.assign({}, obj.fields, { value: obj.value });
    if (obj.value != '' && !obj.fields && obj.elements)
        return { elements: obj.elements, value: obj.value };
    if (obj.value == '' && obj.fields && obj.elements)
        return Object.assign({}, obj.fields, { elements: obj.elements });
    if (obj.value != '' && obj.fields && obj.elements)
        return Object.assign({}, obj.fields, { elements: obj.elements, value: obj.value });
    return obj;
}
function serializeField(field, node, ctx) {
    let type = getType(field.type, ctx);
    let obj = {};
    if (type) {
        if ('parse' in type && field.default)
            obj.value = type.parse(field.default);
        serializeType(obj, type, node, ctx);
    }
    if (field.fields) {
        if (!obj.fields)
            obj.fields = {};
        for (let child of field.fields) {
            obj.fields[child.key] = serializeField(child, node ? node.fields[child.key] : null, ctx);
        }
    }
    if (field.array) {
        if (!obj.elements)
            obj.elements = [];
        if (node) {
            let arrayType = getType(field.array.type, ctx);
            if (arrayType) {
                for (let element of node.elements) {
                    obj.elements.push(serializeType({}, arrayType, element, ctx));
                }
            }
        }
    }
    return obj;
}
function serializeType(obj, type, node, ctx) {
    if ('kind' in type) {
        if (type.kind == "object" /* Object */) {
            serializeType(obj, getType(type.type, ctx), node, ctx);
            if (type.fields) {
                if (!obj.fields)
                    obj.fields = {};
                for (let child of type.fields) {
                    obj.fields[child.key] = serializeField(child, node ? node.fields[child.key] : null, ctx);
                }
            }
        }
        else if (type.kind == "tuple" /* Tuple */) {
            if (type.fields) {
                if (!obj.fields)
                    obj.fields = {};
                let vals = node ? node.line.value.split(' ') : undefined;
                for (let i = 0; i < type.fields.length; i++) {
                    let field = type.fields[i];
                    let fieldType = getType(field.type, ctx);
                    let val = (vals && vals.length > i) ? fieldType.parse(vals[i]) : (field.default ? fieldType.parse(field.default) : undefined);
                    obj.fields[field.key] = val;
                }
            }
        }
        if (type.array) {
            if (!obj.elements)
                obj.elements = [];
            if (node) {
                let arrayType = getType(type.array.type, ctx);
                for (let element of node.elements) {
                    obj.elements.push(serializeType({}, arrayType, element, ctx));
                }
            }
        }
    }
    else {
        if (node)
            obj.value = type.parse(node.line.value);
    }
    return obj;
}
function getType(str, ctx) {
    return ctx.types[str];
}
