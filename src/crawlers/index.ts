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

    const requests = RSSUrls.map(async (url) => {
        const request = await parser
            .parseURL(url)
            .then((feed) => {
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
            })
            .catch((error) => {
                console.error(`Error scraping ${url} : ${error}`);
            });

        return request;
    });

    const settledList = await Promise.allSettled([...requests]);

    return getFulfilledPromiseValueList<FirebaseDtoType>(settledList);
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
