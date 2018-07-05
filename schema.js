"use strict";
var DataType;
(function (DataType) {
    DataType["null"] = "null";
    DataType["int"] = "int";
    DataType["float"] = "float";
    DataType["string"] = "string";
    DataType["bool"] = "bool";
    DataType["array"] = "array";
    DataType["object"] = "object";
})(DataType || (DataType = {}));
var TestType;
(function (TestType) {
    TestType["key"] = "exists";
    TestType["notKey"] = "does not exist";
    TestType["type"] = "is";
    TestType["notType"] = "is not";
    TestType["value"] = "=";
    TestType["notValue"] = "!=";
})(TestType || (TestType = {}));
