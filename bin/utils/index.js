"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewFeedDatas = exports.getFulfilledPromiseValueList = exports.formatNonRssBlogsDate = exports.removeAllWhitespace = void 0;
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
function getNewFeedDatas(prevBlogData, currentBlogData) {
    const newFeedDatas = [];
    const latestUploadDatesByBlog = prevBlogData.map((value) => {
        const blogName = value.blogName;
        const latestUploadDate = value.data[0].pubDate;
        return { blogName, latestUploadDate };
    });
    for (let value of latestUploadDatesByBlog) {
        const { blogName, latestUploadDate } = value;
        const ToMomentDate = (date) => {
            return (0, moment_1.default)(date, "YYYY.MM.DD");
        };
        const matchingBlogData = currentBlogData.find((value) => {
            return value.blogName === blogName;
        });
        if (!matchingBlogData)
            return;
        const currentData = matchingBlogData.data;
        const newFeeds = currentData.filter((value) => {
            return ToMomentDate(value.pubDate).isAfter(ToMomentDate(latestUploadDate));
        });
        if (newFeeds.length > 0) {
            newFeedDatas.push(...newFeeds);
        }
    }
    return newFeedDatas;
}
exports.getNewFeedDatas = getNewFeedDatas;
