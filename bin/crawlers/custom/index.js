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
exports.get화해Data = exports.get쿠팡Data = exports.get카카오페이Data = exports.get카카오스타일Data = exports.get맘시터Data = exports.get그린랩스Data = exports.get강남언니Data = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const utils_1 = require("../../utils");
const moment_1 = __importDefault(require("moment"));
function get강남언니Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataList = [];
        const 강남언니URL = "https://blog.gangnamunni.com";
        const response = yield axios_1.default.get(강남언니URL + "/blog/tech");
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".post-title a");
        for (let el of elements) {
            const detailPageLink = 강남언니URL + $root(el).attr("href");
            const response = yield axios_1.default.get(detailPageLink);
            const $detail = cheerio_1.default.load(response.data);
            const title = $detail(".post-title").text();
            const pubDate = $detail(".post-date").text();
            const data = {
                title: (0, utils_1.removeAllWhitespace)(title),
                link: detailPageLink,
                pubDate: (0, utils_1.removeAllWhitespace)(pubDate),
            };
            dataList.push(data);
        }
        return dataList;
    });
}
exports.get강남언니Data = get강남언니Data;
function get그린랩스Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const 그린랩스URL = "https://green-labs.github.io";
        const 그린랩스DataURL = "https://green-labs.github.io/page-data/index/page-data.json";
        const response = yield axios_1.default.get(그린랩스DataURL);
        const nodes = response.data.result.data.allMdx.nodes;
        const dataList = nodes.map((node) => {
            const { title, date, slug } = node.frontmatter;
            return {
                title,
                pubDate: (0, utils_1.formatNonRssBlogsDate)(date),
                link: 그린랩스URL + slug,
            };
        });
        return dataList;
    });
}
exports.get그린랩스Data = get그린랩스Data;
function get맘시터Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const blogData = [];
        const 맘시터URL = "https://tech.mfort.co.kr";
        const response = yield axios_1.default.get(맘시터URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".summary-item");
        for (let element of elements) {
            const title = $root(element).find("h2").text();
            const pubDate = $root(element).find(".text-sm").text();
            const link = 맘시터URL + $root(element).find("a").attr("href");
            blogData.push({
                title,
                link,
                pubDate: (0, utils_1.formatNonRssBlogsDate)(pubDate),
            });
        }
        return blogData;
    });
}
exports.get맘시터Data = get맘시터Data;
function get카카오스타일Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const blogData = [];
        const 카카오스타일URL = "https://devblog.kakaostyle.com";
        const response = yield axios_1.default.get(카카오스타일URL + "/ko");
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".col-12.col-lg-9").children();
        for (let element of elements) {
            const title = $root(element).find(".posts-title a").text();
            const pubDate = $root(element).find(".posts-date").text();
            const link = 카카오스타일URL + $root(element).find(".posts-title a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "DD MMM YYYY");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            if (title && link) {
                blogData.push({
                    title,
                    link,
                    pubDate: parsedDate,
                });
            }
        }
        return blogData;
    });
}
exports.get카카오스타일Data = get카카오스타일Data;
function get카카오페이Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const blogData = [];
        const 카카오페이URL = "https://tech.kakaopay.com";
        const response = yield axios_1.default.get(카카오페이URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root("._postList_xp5mg_34 ul").children();
        for (let element of elements) {
            const title = $root(element).find("h3").text();
            const pubDate = $root(element).find("time").text();
            const link = 카카오페이URL + $root(element).find("a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "YYYY. M. DD");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            blogData.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return blogData;
    });
}
exports.get카카오페이Data = get카카오페이Data;
function get쿠팡Data() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const blogData = [];
        const 쿠팡URL = "https://medium.com/@coupang-engineering-kr";
        const mediumURL = "https://medium.com";
        const response = yield axios_1.default.get(쿠팡URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".ix.l article");
        for (let element of elements) {
            const title = $root(element).find("h2").text();
            const pubDate = $root(element).find("a .bd.b.be.z.dk span").last().text();
            const link = (_a = mediumURL + $root(element).find(".ab.q a").attr("href")) !== null && _a !== void 0 ? _a : "";
            const baseDate = (0, moment_1.default)(pubDate, "MMM DD, YYYY");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            blogData.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return blogData;
    });
}
exports.get쿠팡Data = get쿠팡Data;
function get화해Data() {
    return __awaiter(this, void 0, void 0, function* () {
        const blogData = [];
        const 화해URL = "https://blog.hwahae.co.kr/category/all/tech";
        const detail화해URL = "https://blog.hwahae.co.kr/all/tech";
        const response = yield axios_1.default.get(화해URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".e17bt4f62.css-1yjtq2.e1djbxbw1");
        for (let element of elements) {
            const title = $root(element).find(".css-smhxnw.e1djbxbw5").text();
            const pubDate = $root(element).find(".css-18pnawy.e1djbxbw6").text();
            const link = detail화해URL + $root(element).find("a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "YYYY. MM. DD");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            blogData.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return blogData;
    });
}
exports.get화해Data = get화해Data;
