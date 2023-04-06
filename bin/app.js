"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crawler = __importStar(require("./crawlers"));
const initializeFirebase_1 = __importDefault(require("./utils/initializeFirebase"));
const api_1 = require("./utils/api");
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
function main() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const firestore = (0, initializeFirebase_1.default)();
        dotenv_1.default.config();
        const slackChannel = (_a = process.env.SLACK_CHANNEL_CODE) !== null && _a !== void 0 ? _a : "";
        const slackBotToken = (_b = process.env.SLACK_BOT_TOKEN) !== null && _b !== void 0 ? _b : "";
        const prevBlogData = yield (0, api_1.getBlogDatas)(firestore);
        const withRSSBlogData = yield crawler.getTechBlogDataWithRSS();
        const withoutRSSBlogData = yield crawler.getTechBlogDataWithoutRSS();
        const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];
        const newBlogData = (_c = (0, utils_1.getNewFeedDatas)(prevBlogData, currentBlogData)) !== null && _c !== void 0 ? _c : [];
        yield (0, api_1.sendSlackMessage)(slackBotToken, slackChannel, newBlogData);
    });
}
main();
