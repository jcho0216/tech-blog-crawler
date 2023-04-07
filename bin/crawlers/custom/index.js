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
exports.getHwahaeData = exports.getCoupangData = exports.getKakaoPayData = exports.getKakaoStyleData = exports.getMfortData = exports.getGreenLabsData = exports.getGangnamunniData = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const utils_1 = require("../../utils");
const moment_1 = __importDefault(require("moment"));
function getGangnamunniData() {
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const GANGNAMUNNI_URL = "https://blog.gangnamunni.com";
        const response = yield axios_1.default.get(GANGNAMUNNI_URL + "/blog/tech");
        const $root = cheerio_1.default.load(response.data);
        const blogTitle = $root("title").text();
        const elements = $root(".post-title a");
        for (let el of elements) {
            const detailPageLink = GANGNAMUNNI_URL + $root(el).attr("href");
            const response = yield axios_1.default.get(detailPageLink);
            const $detail = cheerio_1.default.load(response.data);
            const title = $detail("h1.post-title").text();
            const pubDate = $detail(".post-date").text();
            const data = {
                title: (0, utils_1.removeAllWhitespace)(title),
                link: detailPageLink,
                pubDate: (0, utils_1.removeAllWhitespace)(pubDate),
            };
            feedDataList.push(data);
        }
        return { blogName: blogTitle, data: feedDataList };
    });
}
exports.getGangnamunniData = getGangnamunniData;
function getGreenLabsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const GREEN_LABS_URL = "https://green-labs.github.io";
        const GREEN_LABS_DATA_SOURCE_URL = "https://green-labs.github.io/page-data/index/page-data.json";
        const response = yield axios_1.default.get(GREEN_LABS_DATA_SOURCE_URL);
        const blogTitle = "greenlabs tech";
        const nodes = response.data.result.data.allMdx.nodes;
        const feedDataList = nodes.map((node) => {
            const { title, date, slug } = node.frontmatter;
            return {
                title,
                pubDate: (0, utils_1.formatNonRssBlogsDate)(date),
                link: GREEN_LABS_URL + slug,
            };
        });
        return {
            blogName: blogTitle,
            data: feedDataList,
        };
    });
}
exports.getGreenLabsData = getGreenLabsData;
function getMfortData() {
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const MFORT_URL = "https://tech.mfort.co.kr";
        const response = yield axios_1.default.get(MFORT_URL);
        const $root = cheerio_1.default.load(response.data);
        const blogTitle = (0, utils_1.removeAllWhitespace)($root("title").text());
        const elements = $root(".summary-item");
        for (let element of elements) {
            const title = $root(element).find("h2").text();
            const pubDate = $root(element).find(".text-sm").text();
            const link = MFORT_URL + $root(element).find("a").attr("href");
            feedDataList.push({
                title,
                link,
                pubDate: (0, utils_1.formatNonRssBlogsDate)(pubDate),
            });
        }
        return {
            blogName: blogTitle,
            data: feedDataList,
        };
    });
}
exports.getMfortData = getMfortData;
function getKakaoStyleData() {
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const KAKAO_STYLE_URL = "https://devblog.kakaostyle.com";
        const response = yield axios_1.default.get(KAKAO_STYLE_URL + "/ko");
        const $root = cheerio_1.default.load(response.data);
        const blogTitle = $root("title").text();
        const elements = $root(".col-12.col-lg-9").children();
        for (let element of elements) {
            const title = $root(element).find(".posts-title a").text();
            const pubDate = $root(element).find(".posts-date").text();
            const link = KAKAO_STYLE_URL + $root(element).find(".posts-title a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "DD MMM YYYY");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            if (title && link) {
                feedDataList.push({
                    title,
                    link,
                    pubDate: parsedDate,
                });
            }
        }
        return { blogName: blogTitle, data: feedDataList };
    });
}
exports.getKakaoStyleData = getKakaoStyleData;
function getKakaoPayData() {
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const KAKAO_PAY_URL = "https://tech.kakaopay.com";
        const response = yield axios_1.default.get(KAKAO_PAY_URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root("._postList_xp5mg_34 ul").children();
        const blogTitle = $root("title").text();
        for (let element of elements) {
            const title = $root(element).find("h3").text();
            const pubDate = $root(element).find("time").text();
            const link = KAKAO_PAY_URL + $root(element).find("a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "YYYY. M. DD");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            feedDataList.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return {
            blogName: blogTitle,
            data: feedDataList,
        };
    });
}
exports.getKakaoPayData = getKakaoPayData;
function getCoupangData() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const COUPANG_URL = "https://medium.com/@coupang-engineering-kr";
        const mediumURL = "https://medium.com";
        const response = yield axios_1.default.get(COUPANG_URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".ix.l article");
        const blogTitle = $root("title").text();
        for (let element of elements) {
            const title = $root(element).find("h2").text();
            const pubDate = $root(element).find("a .bd.b.be.z.dk span").last().text();
            const link = (_a = mediumURL + $root(element).find(".ab.q a").attr("href")) !== null && _a !== void 0 ? _a : "";
            const baseDate = (0, moment_1.default)(pubDate, "MMM DD, YYYY");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            feedDataList.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return {
            blogName: blogTitle,
            data: feedDataList,
        };
    });
}
exports.getCoupangData = getCoupangData;
function getHwahaeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const feedDataList = [];
        const HWAHAE_URL = "https://blog.hwahae.co.kr/category/all/tech";
        const HWAHAE_URL_FOR_DETAIL = "https://blog.hwahae.co.kr/all/tech";
        const response = yield axios_1.default.get(HWAHAE_URL);
        const $root = cheerio_1.default.load(response.data);
        const elements = $root(".e17bt4f62.css-1yjtq2.e1djbxbw1");
        const blogTitle = $root("title").text();
        for (let element of elements) {
            const title = $root(element).find(".css-smhxnw.e1djbxbw5").text();
            const pubDate = $root(element).find(".css-18pnawy.e1djbxbw6").text();
            const link = HWAHAE_URL_FOR_DETAIL + $root(element).find("a").attr("href");
            const baseDate = (0, moment_1.default)(pubDate, "YYYY. MM. DD");
            const parsedDate = baseDate.format("YYYY.MM.DD");
            feedDataList.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
        return {
            blogName: blogTitle,
            data: feedDataList,
        };
    });
}
exports.getHwahaeData = getHwahaeData;
