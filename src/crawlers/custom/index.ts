import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { FeedDataType, FirebaseDtoType, GreenLabsApiResponseType } from "../../interface";
import { formatNonRssBlogsDate, removeAllWhitespace } from "../../utils";
import moment from "moment";

export async function getGangnamunniData() {
    const feedDataList: FeedDataType[] = [];
    const GANGNAMUNNI_URL = "https://blog.gangnamunni.com";

    const response: AxiosResponse<string> = await axios.get(GANGNAMUNNI_URL + "/blog/tech");

    const $root = cheerio.load(response.data);
    const blogTitle = $root("title").text();

    const elements = $root(".post-title a");

    for (let el of elements) {
        const detailPageLink = GANGNAMUNNI_URL + $root(el).attr("href");
        const response: AxiosResponse<string> = await axios.get(detailPageLink);

        const $detail = cheerio.load(response.data);

        const title = $detail(".post-title").text();
        const pubDate = $detail(".post-date").text();

        const data: FeedDataType = {
            title: removeAllWhitespace(title),
            link: detailPageLink,
            pubDate: removeAllWhitespace(pubDate),
        };

        feedDataList.push(data);
    }

    return { blogName: blogTitle, data: feedDataList } as FirebaseDtoType;
}

export async function getGreenLabsData() {
    const GREEN_LABS_URL = "https://green-labs.github.io";
    const GREEN_LABS_DATA_SOURCE_URL = "https://green-labs.github.io/page-data/index/page-data.json";

    const response: AxiosResponse<GreenLabsApiResponseType> = await axios.get(GREEN_LABS_DATA_SOURCE_URL);

    const blogTitle = "greenlabs tech";
    const nodes = response.data.result.data.allMdx.nodes;

    const feedDataList = nodes.map((node) => {
        const { title, date, slug } = node.frontmatter;

        return {
            title,
            pubDate: formatNonRssBlogsDate(date),
            link: GREEN_LABS_URL + slug,
        } as FeedDataType;
    });

    return {
        blogName: blogTitle,
        data: feedDataList,
    } as FirebaseDtoType;
}

export async function getMfortData() {
    const feedDataList: FeedDataType[] = [];
    const MFORT_URL = "https://tech.mfort.co.kr";
    const response: AxiosResponse<string> = await axios.get(MFORT_URL);

    const $root = cheerio.load(response.data);
    const blogTitle = removeAllWhitespace($root("title").text());
    const elements = $root(".summary-item");

    for (let element of elements) {
        const title = $root(element).find("h2").text();
        const pubDate = $root(element).find(".text-sm").text();
        const link = MFORT_URL + $root(element).find("a").attr("href");

        feedDataList.push({
            title,
            link,
            pubDate: formatNonRssBlogsDate(pubDate),
        });
    }

    return {
        blogName: blogTitle,
        data: feedDataList,
    } as FirebaseDtoType;
}

export async function getKakaoStyleData() {
    const feedDataList: FeedDataType[] = [];
    const KAKAO_STYLE_URL = "https://devblog.kakaostyle.com";
    const response: AxiosResponse<string> = await axios.get(KAKAO_STYLE_URL + "/ko");

    const $root = cheerio.load(response.data);
    const blogTitle = $root("title").text();

    const elements = $root(".col-12.col-lg-9").children();

    for (let element of elements) {
        const title = $root(element).find(".posts-title a").text();
        const pubDate = $root(element).find(".posts-date").text();
        const link = KAKAO_STYLE_URL + $root(element).find(".posts-title a").attr("href");

        const baseDate = moment(pubDate, "DD MMM YYYY");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        if (title && link) {
            feedDataList.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
    }

    return { blogName: blogTitle, data: feedDataList } as FirebaseDtoType;
}

export async function getKakaoPayData() {
    const feedDataList: FeedDataType[] = [];
    const KAKAO_PAY_URL = "https://tech.kakaopay.com";
    const response: AxiosResponse<string> = await axios.get(KAKAO_PAY_URL);

    const $root = cheerio.load(response.data);
    const elements = $root("._postList_xp5mg_34 ul").children();
    const blogTitle = $root("title").text();

    for (let element of elements) {
        const title = $root(element).find("h3").text();
        const pubDate = $root(element).find("time").text();
        const link = KAKAO_PAY_URL + $root(element).find("a").attr("href");

        const baseDate = moment(pubDate, "YYYY. M. DD");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        feedDataList.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return {
        blogName: blogTitle,
        data: feedDataList,
    } as FirebaseDtoType;
}

export async function getCoupangData() {
    const feedDataList: FeedDataType[] = [];
    const COUPANG_URL = "https://medium.com/@coupang-engineering-kr";
    const mediumURL = "https://medium.com";
    const response: AxiosResponse<string> = await axios.get(COUPANG_URL);

    const $root = cheerio.load(response.data);
    const elements = $root(".ix.l article");
    const blogTitle = $root("title").text();

    for (let element of elements) {
        const title = $root(element).find("h2").text();
        const pubDate = $root(element).find("a .bd.b.be.z.dk span").last().text();
        const link = mediumURL + $root(element).find(".ab.q a").attr("href") ?? "";

        const baseDate = moment(pubDate, "MMM DD, YYYY");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        feedDataList.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return {
        blogName: blogTitle,
        data: feedDataList,
    } as FirebaseDtoType;
}

export async function getHwahaeData() {
    const feedDataList: FeedDataType[] = [];
    const HWAHAE_URL = "https://blog.hwahae.co.kr/category/all/tech";
    const HWAHAE_URL_FOR_DETAIL = "https://blog.hwahae.co.kr/all/tech";
    const response: AxiosResponse<string> = await axios.get(HWAHAE_URL);

    const $root = cheerio.load(response.data);
    const elements = $root(".e17bt4f62.css-1yjtq2.e1djbxbw1");
    const blogTitle = $root("title").text();

    for (let element of elements) {
        const title = $root(element).find(".css-smhxnw.e1djbxbw5").text();
        const pubDate = $root(element).find(".css-18pnawy.e1djbxbw6").text();
        const link = HWAHAE_URL_FOR_DETAIL + $root(element).find("a").attr("href");

        const baseDate = moment(pubDate, "YYYY. MM. DD");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        feedDataList.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return {
        blogName: blogTitle,
        data: feedDataList,
    } as FirebaseDtoType;
}
