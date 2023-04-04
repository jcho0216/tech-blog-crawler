import moment from "moment";
import Parser from "rss-parser";
import {
    get강남언니Data,
    get그린랩스Data,
    get맘시터Data,
    get카카오스타일Data,
    get카카오페이Data,
    get쿠팡Data,
    get화해Data,
} from "./custom";

import { BlogDataType } from "../interface";
import { getFulfilledPromiseValueList } from "../utils";
import { RSSUrls } from "../constant";

export async function getTechBlogDataWithRSS() {
    const parser = new Parser();

    const requests = RSSUrls.map(async (url) => {
        const request = await parser
            .parseURL(url)
            .then((feed) =>
                feed.items.map((item) => {
                    const { title, link, pubDate } = item;
                    const parsedDate = moment(pubDate).format("YYYY.MM.DD");

                    const data: BlogDataType = {
                        title: title ?? "",
                        link: link ?? "",
                        pubDate: parsedDate,
                    };

                    return data;
                })
            )
            .catch((error) => {
                console.error(`Error scraping ${url} : ${error}`);
            });

        return request;
    });

    const settledList = await Promise.allSettled([...requests]);

    return getFulfilledPromiseValueList<BlogDataType[]>(settledList);
}

export async function getTechBlogDataWithoutRSS() {
    const settledList = await Promise.allSettled([
        get강남언니Data(),
        get그린랩스Data(),
        get맘시터Data(),
        get카카오스타일Data(),
        get카카오페이Data(),
        get쿠팡Data(),
        get화해Data(),
    ]);

    return getFulfilledPromiseValueList<BlogDataType[]>(settledList);
}
