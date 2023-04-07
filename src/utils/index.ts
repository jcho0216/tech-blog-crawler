import moment from "moment";
import { FirebaseDtoType } from "../interface";

export function removeAllWhitespace(value: string) {
    const temp = value.replace("\n", "");
    return temp.trim();
}

export function formatNonRssBlogsDate(value: string) {
    const baseDate = moment(value, "YYYY년 MM월 DD일");
    return baseDate.format("YYYY.MM.DD");
}

export function getFulfilledPromiseValueList<T>(promiseSettledList: PromiseSettledResult<T | void>[]) {
    const fulfilledList = promiseSettledList
        .filter((value) => value.status === "fulfilled")
        .map((value) => (value as PromiseFulfilledResult<T>).value);

    return fulfilledList;
}

export function getNewFeedDatas(prevBlogDatas: FirebaseDtoType[], currentBlogDatas: FirebaseDtoType[]) {
    const newFeedDatas: FirebaseDtoType[] = [];

    for (let prevBlogData of prevBlogDatas) {
        const { blogName: prevBlogDataBlogname, data: prevBlogFeedData } = prevBlogData;
        const matchingBlogDataInCurrent = currentBlogDatas.find((currentBlogData) => {
            return currentBlogData.blogName === prevBlogDataBlogname;
        });

        if (!matchingBlogDataInCurrent) continue;
        const oldKeys = prevBlogFeedData.map((value) => `${value.title}-${value.pubDate}`);

        const newFeeds = matchingBlogDataInCurrent.data.filter((value) => {
            const newBlogDataKey = `${value.title}-${value.pubDate}`;

            const isNewFeed = !oldKeys.includes(newBlogDataKey);
            return isNewFeed;
        });

        if (newFeeds.length <= 0) continue;
        newFeedDatas.push({ blogName: prevBlogDataBlogname, data: newFeeds } as FirebaseDtoType);
    }

    return newFeedDatas;
}
