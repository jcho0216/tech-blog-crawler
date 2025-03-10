import moment from "moment";
import Parser from "rss-parser";
import {
  getGangnamunniData,
  getGreenLabsData,
  getMfortData,
  getKakaoStyleData,
  getKakaoPayData,
  getCoupangData,
  getHwahaeData,
} from "./custom";

import { FeedDataType, FirebaseDtoType } from "../interface";
import { getFulfilledPromiseValueList } from "../utils";
import { RSSUrls } from "../constant";

export async function getTechBlogDataWithRSS() {
  const parser = new Parser({
    headers: {
      Accept: "*/*",
    },
  });

  const requests = RSSUrls.map((url) => {
    const request = parser
      .parseURL(url)
      .then(async (feed) => {
        await setTimeout(() => {}, 100);
        const blogTitle = feed.title ?? "";

        const blogData = feed.items.map((item) => {
          const { title, link, pubDate } = item;
          const parsedDate = moment(pubDate).format("YYYY.MM.DD");

          return {
            title: title ?? "",
            link: link ?? "",
            pubDate: parsedDate,
          } as FeedDataType;
        });

        return {
          blogName: blogTitle,
          data: blogData,
        } as FirebaseDtoType;
      });

    return request;
  });

  const settledList = (await Promise.allSettled([...requests])).filter(e => e.status == 'fulfilled');

  return getFulfilledPromiseValueList<FirebaseDtoType>(settledList as PromiseSettledResult<FirebaseDtoType>[]);
}

export async function getTechBlogDataWithoutRSS() {
  const settledList = await Promise.allSettled([
    getGangnamunniData(),
    getGreenLabsData(),
    getMfortData(),
    getKakaoStyleData(),
    getKakaoPayData(),
    getCoupangData(),
    getHwahaeData(),
  ]);

  return getFulfilledPromiseValueList<FirebaseDtoType>(settledList);
}
