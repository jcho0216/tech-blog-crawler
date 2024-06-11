import dotenv from "dotenv";
import cron from "node-cron";

import * as crawler from "./crawlers";
import initializeFirestore from "./utils/initializeFirebase";
import { getBlogDatas, postBlogDatas, sendSlackMessage } from "./utils/api";
import { formatDate, getNewFeedDatas } from "./utils";

async function main() {
    const firestore = initializeFirestore();
    dotenv.config();

    // 평일 오전 10시 실행
    const crawlingCycle = "0 10 * * 1-5";
    const date = new Date();

    cron.schedule(crawlingCycle, async () => {
        try {
            console.log(`크롤링 시작  ${formatDate(date)}`);
            const prevBlogData = await getBlogDatas(firestore);

            const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
            const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();
            console.log('크롤링 완료');
            const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];

            const newFeeds = getNewFeedDatas(prevBlogData, currentBlogData) ?? [];

            console.log(newFeeds);

            if (newFeeds.length <= 0) return;
            console.log('슬랙 메시지 전송 시작');
            await sendSlackMessage(newFeeds);
            console.log('슬랙 메시지 전송 완료');

            console.log('데이터 업데이트 시작');
            await postBlogDatas(firestore, currentBlogData);
            console.log(`데이터 업데이트 완료 ${formatDate(date)}`);
        } catch (error) {
            console.log(`에러가 발생하였습니다. ${formatDate(date)}`, error);
        }
    });
}

main();