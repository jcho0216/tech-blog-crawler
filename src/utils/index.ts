import moment from "moment";
import { FirebaseDtoType } from "../interface";

export function removeAllWhitespace(value: string) {
    const temp = value.replaceAll("\n", "");
    return temp.replaceAll(" ", "");
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
        const { blogName, data: prevBlogFeedData } = prevBlogData;
        const latestUploadDate = prevBlogFeedData[0].pubDate;

        const ToMomentDate = (date: string) => {
            return moment(date, "YYYY.MM.DD");
        };

        const matchingBlogDataInCurrent = currentBlogDatas.find((currentBlogData) => {
            return currentBlogData.blogName === blogName;
        });

        if (!matchingBlogDataInCurrent) return;
        const newFeeds = matchingBlogDataInCurrent.data.filter((value) => {
            return ToMomentDate(value.pubDate).isAfter(ToMomentDate(latestUploadDate));
        });

        if (newFeeds.length > 0) {
            newFeedDatas.push({ blogName, data: newFeeds } as FirebaseDtoType);
        }
    }

    return newFeedDatas;
}
