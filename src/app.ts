import dotenv from "dotenv";
import cron from "node-cron";

import * as crawler from "./crawlers";
import initializeFirestore from "./utils/initializeFirebase";
import { getBlogDatas, postBlogDatas, sendGreetings, sendSlackMessage } from "./utils/api";
import { getNewFeedDatas } from "./utils";

async function main() {
    const firestore = initializeFirestore();
    dotenv.config();

    // 평일 오전 10시 실행
    const crawlingCycle = "0 10 * * 1-5";

    cron.schedule(crawlingCycle, async () => {
        const prevBlogData = await getBlogDatas(firestore);

        const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
        const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();

        const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];

        const newFeeds = getNewFeedDatas(prevBlogData, currentBlogData) ?? [];

        if (newFeeds.length <= 0) return;

        await sendGreetings();
        await sendSlackMessage(newFeeds);

        await postBlogDatas(firestore, currentBlogData);
    });
}

main();
