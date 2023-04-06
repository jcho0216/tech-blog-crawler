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

export function getNewFeedDatas(prevBlogData: FirebaseDtoType[], currentBlogData: FirebaseDtoType[]) {
    const newFeedDatas = [];
    const latestUploadDatesByBlog = prevBlogData.map((value) => {
        const blogName = value.blogName;
        const latestUploadDate = value.data[0].pubDate;

        return { blogName, latestUploadDate };
    });

    for (let value of latestUploadDatesByBlog) {
        const { blogName, latestUploadDate } = value;

        const ToMomentDate = (date: string) => {
            return moment(date, "YYYY.MM.DD");
        };

        const matchingBlogData = currentBlogData.find((value) => {
            return value.blogName === blogName;
        });

        if (!matchingBlogData) return;

        const currentData = matchingBlogData.data;
        const newFeeds = currentData.filter((value) => {
            return ToMomentDate(value.pubDate).isAfter(ToMomentDate(latestUploadDate));
        });

        if (newFeeds.length > 0) {
            newFeedDatas.push(...newFeeds);
        }
    }

    return newFeedDatas;
}
