"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTechBlogDataWithoutRSS = exports.getTechBlogDataWithRSS = void 0;
const moment_1 = __importDefault(require("moment"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const custom_1 = require("./custom");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
function getTechBlogDataWithRSS() {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new rss_parser_1.default({
            headers: {
                Accept: "*/*",
            },
        });
        const requests = constant_1.RSSUrls.map((url) => __awaiter(this, void 0, void 0, function* () {
            const request = yield parser
                .parseURL(url)
                .then((feed) => {
                var _a;
                const blogTitle = (_a = feed.title) !== null && _a !== void 0 ? _a : "";
                const blogData = feed.items.map((item) => {
                    const { title, link, pubDate } = item;
                    const parsedDate = (0, moment_1.default)(pubDate).format("YYYY.MM.DD");
                    return {
                        title: title !== null && title !== void 0 ? title : "",
                        link: link !== null && link !== void 0 ? link : "",
                        pubDate: parsedDate,
                    };
                });
                return {
                    blogName: blogTitle,
                    data: blogData,
                };
            })
                .catch((error) => {
                console.error(`Error scraping ${url} : ${error}`);
            });
            return request;
        }));
        const settledList = yield Promise.allSettled([...requests]);
        return (0, utils_1.getFulfilledPromiseValueList)(settledList);
    });
}
exports.getTechBlogDataWithRSS = getTechBlogDataWithRSS;
function getTechBlogDataWithoutRSS() {
    return __awaiter(this, void 0, void 0, function* () {
        const settledList = yield Promise.allSettled([
            (0, custom_1.getGangnamunniData)(),
            (0, custom_1.getGreenLabsData)(),
            (0, custom_1.getMfortData)(),
            (0, custom_1.getKakaoStyleData)(),
            (0, custom_1.getKakaoPayData)(),
            (0, custom_1.getCoupangData)(),
            (0, custom_1.getHwahaeData)(),
        ]);
        return (0, utils_1.getFulfilledPromiseValueList)(settledList);
    });
}
exports.getTechBlogDataWithoutRSS = getTechBlogDataWithoutRSS;
