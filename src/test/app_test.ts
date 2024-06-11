import dotenv from "dotenv";

import * as crawler from "../crawlers";
import initializeFirestore from "../utils/initializeFirebase";
import { getBlogDatas } from "../utils/api";
import { formatDate, getNewFeedDatas } from "../utils";

async function main() {
  const firestore = initializeFirestore();
  dotenv.config();

  const date = new Date();

  try {
    console.log(`크롤링 시작  ${formatDate(date)}`);
    const prevBlogData = await getBlogDatas(firestore);

    const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
    const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();
    console.log("크롤링 완료");
    const currentBlogData = [...withRSSBlogData, ...withoutRSSBlogData];

    const newFeeds = getNewFeedDatas(prevBlogData, currentBlogData) ?? [];

    console.log(newFeeds);
  } catch (error) {
    console.log(`에러가 발생하였습니다. ${formatDate(date)}`, error);
  }
}

main();
