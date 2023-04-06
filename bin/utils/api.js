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
function sendGreetings() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const slackChannel = (_a = process.env.SLACK_CHANNEL_CODE) !== null && _a !== void 0 ? _a : "";
        const slackBotToken = (_b = process.env.SLACK_BOT_TOKEN) !== null && _b !== void 0 ? _b : "";
        const slackbot = new web_api_1.WebClient(slackBotToken);
        const date = (0, moment_1.default)().locale('ko').format("YYYY년 M월 D일, a h시");
        yield slackbot.chat.postMessage({
            channel: slackChannel,
            text: `*${date} 기준 최신 블로그 글 목록!*`,
        });
    });
}
exports.sendGreetings = sendGreetings;
function sendSlackMessage(blogDatas) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const slackChannel = (_a = process.env.SLACK_CHANNEL_CODE) !== null && _a !== void 0 ? _a : "";
        const slackBotToken = (_b = process.env.SLACK_BOT_TOKEN) !== null && _b !== void 0 ? _b : "";
        const { chat } = new web_api_1.WebClient(slackBotToken);
        for (let blogData of blogDatas) {
            const { blogName, data: feedDatas } = blogData;
            yield chat.postMessage({
                channel: slackChannel,
                text: `[ *_${blogName}_* ]`,
                mrkdwn: true,
            });
            for (let feedData of feedDatas) {
                const date = feedData.pubDate;
                yield chat.postMessage({
                    channel: slackChannel,
                    text: `∙  <${feedData.link}|${feedData.title}> (${date})`,
                    mrkdwn: true,
                    unfurl_links: true,
                    unfurl_media: true,
                });
            }
        }
    });
}
exports.sendSlackMessage = sendSlackMessage;
