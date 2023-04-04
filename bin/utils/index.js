"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFulfilledPromiseValueList = exports.formatNonRssBlogsDate = exports.removeAllWhitespace = void 0;
const moment_1 = __importDefault(require("moment"));
function removeAllWhitespace(value) {
    const temp = value.replaceAll("\n", "");
    return temp.replaceAll(" ", "");
}
exports.removeAllWhitespace = removeAllWhitespace;
function formatNonRssBlogsDate(value) {
    const baseDate = (0, moment_1.default)(value, "YYYY년 MM월 DD일");
    return baseDate.format("YYYY.MM.DD");
}
exports.formatNonRssBlogsDate = formatNonRssBlogsDate;
function getFulfilledPromiseValueList(promiseSettledList) {
    const fulfilledList = promiseSettledList
        .filter((value) => value.status === "fulfilled")
        .map((value) => value.value);
    return fulfilledList;
}
exports.getFulfilledPromiseValueList = getFulfilledPromiseValueList;
