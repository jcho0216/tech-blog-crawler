import moment from "moment";

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
