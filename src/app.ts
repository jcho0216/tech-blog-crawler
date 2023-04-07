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
    const crawlingCycle = "0 9 * * 1-5";

    cron.schedule(crawlingCycle, async () => {
        try {
            console.log("크롤링 시작");
            const prevBlogData = await getBlogDatas(firestore);
            
            const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
            const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();
            
            const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];
            
            const newFeeds = getNewFeedDatas(prevBlogData, currentBlogData) ?? [];
            
            if (newFeeds.length <= 0) return;
            
            await sendGreetings();
            await sendSlackMessage(newFeeds);
            
            await postBlogDatas(firestore, currentBlogData);
            console.log('크롤링 완료')
        } catch (error) {
            console.log('에러가 발생하였습니다.', error);
        }
    });
}

main();
