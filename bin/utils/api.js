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
exports.sendSlackMessage = exports.sendGreetings = exports.postBlogDatas = exports.getBlogDatas = void 0;
const web_api_1 = require("@slack/web-api");
const moment_1 = __importDefault(require("moment"));
function getBlogDatas(firestore) {
    return __awaiter(this, void 0, void 0, function* () {
        const documentSnapshots = yield firestore.collection("blogs").get();
        const blogData = documentSnapshots.docs.map((value) => {
            const blogName = value.id;
            const data = value.data().data;
            return { blogName, data };
        });
        return blogData;
    });
}
exports.getBlogDatas = getBlogDatas;
function postBlogDatas(firestore, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const requests = data.map((value) => {
            return firestore.collection("blogs").doc(value.blogName).set({ data: value.data });
        });
        yield Promise.allSettled([...requests]);
    });
}
exports.postBlogDatas = postBlogDatas;
function sendGreetings(token, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackbot = new web_api_1.WebClient(token);
        yield slackbot.chat.postMessage({
            channel,
            text: `*“모두가 함께 앞으로 나아가면 성공은 저절로 따라옵니다.” — 미국 기업가이자 Ford Motor Company 창립자 Henry Ford*`,
            mrkdwn: true,
            unfurl_links: true,
        });
    });
}
exports.sendGreetings = sendGreetings;
function sendSlackMessage(token, channel, data) {
    return __awaiter(this, void 0, void 0, function* () {
        data.map((feedData) => __awaiter(this, void 0, void 0, function* () {
            const baseDate = (0, moment_1.default)(feedData.pubDate, "YYYY.MM.DD");
            const parsedDate = baseDate.format("YYYY년 MM월 DD일");
            const slackbot = new web_api_1.WebClient(token);
            yield slackbot.chat.postMessage({
                channel,
                text: ` \n제목 : *${feedData.title}* \n날짜 : ${parsedDate}\n링크 : <${feedData.link}|글 보러가기>`,
                mrkdwn: true,
                unfurl_links: true,
            });
        }));
    });
}
exports.sendSlackMessage = sendSlackMessage;
