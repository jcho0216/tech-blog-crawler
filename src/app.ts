import * as crawler from "./crawlers";
import initializeFirestore from "./utils/initializeFirebase";
import { getBlogDatas, postBlogDatas, sendSlackMessage } from "./utils/api";

import dotenv from "dotenv";
import { getNewFeedDatas } from "./utils";

async function main() {
    const firestore = initializeFirestore();
    dotenv.config();

    const slackChannel = process.env.SLACK_CHANNEL_CODE ?? "";
    const slackBotToken = process.env.SLACK_BOT_TOKEN ?? "";

    const prevBlogData = await getBlogDatas(firestore);

    const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
    const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();

    const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];

    const newBlogData = getNewFeedDatas(prevBlogData, currentBlogData) ?? [];

    await sendSlackMessage(slackBotToken, slackChannel, newBlogData);
    // await postBlogDatas(firestore, currentBlogData);
}

main();
