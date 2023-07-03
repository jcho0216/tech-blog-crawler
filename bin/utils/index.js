"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.getNewFeedDatas = exports.getFulfilledPromiseValueList = exports.formatNonRssBlogsDate = exports.removeAllWhitespace = void 0;
const moment_1 = __importDefault(require("moment"));
function removeAllWhitespace(value) {
    const temp = value.replace("\n", "");
    return temp.trim();
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
function getNewFeedDatas(prevBlogDatas, currentBlogDatas) {
    const newFeedDatas = [];
    for (let prevBlogData of prevBlogDatas) {
        const { blogName: prevBlogDataBlogname, data: prevBlogFeedData } = prevBlogData;
        const matchingBlogDataInCurrent = currentBlogDatas.find((currentBlogData) => {
            return currentBlogData.blogName === prevBlogDataBlogname;
        });
        if (!matchingBlogDataInCurrent)
            continue;
        const oldKeys = prevBlogFeedData.map((value) => `${value.title}-${value.pubDate}`);
        const newFeeds = matchingBlogDataInCurrent.data.filter((value) => {
            const newBlogDataKey = `${value.title}-${value.pubDate}`;
            const isNewFeed = !oldKeys.includes(newBlogDataKey);
            return isNewFeed;
        });
        if (newFeeds.length <= 0)
            continue;
        newFeedDatas.push({ blogName: prevBlogDataBlogname, data: newFeeds });
    }
    return newFeedDatas;
}
exports.getNewFeedDatas = getNewFeedDatas;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일, ${hours}:${minutes}:${seconds}`;
}
exports.formatDate = formatDate;
