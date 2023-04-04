import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { BlogDataType, 그린랩스Type } from "../../interface";
import { formatNonRssBlogsDate, removeAllWhitespace } from "../../utils";
import moment from "moment";

export async function get강남언니Data() {
    const dataList: BlogDataType[] = [];
    const 강남언니URL = "https://blog.gangnamunni.com";

    const response: AxiosResponse<string> = await axios.get(강남언니URL + "/blog/tech");

    const $root = cheerio.load(response.data);
    const elements = $root(".post-title a");

    for (let el of elements) {
        const detailPageLink = 강남언니URL + $root(el).attr("href");
        const response: AxiosResponse<string> = await axios.get(detailPageLink);

        const $detail = cheerio.load(response.data);

        const title = $detail(".post-title").text();
        const pubDate = $detail(".post-date").text();

        const data: BlogDataType = {
            title: removeAllWhitespace(title),
            link: detailPageLink,
            pubDate: removeAllWhitespace(pubDate),
        };

        dataList.push(data);
    }

    return dataList;
}

export async function get그린랩스Data() {
    const 그린랩스URL = "https://green-labs.github.io";
    const 그린랩스DataURL = "https://green-labs.github.io/page-data/index/page-data.json";

    const response: AxiosResponse<그린랩스Type> = await axios.get(그린랩스DataURL);

    const nodes = response.data.result.data.allMdx.nodes;

    const dataList = nodes.map((node) => {
        const { title, date, slug } = node.frontmatter;

        return {
            title,
            pubDate: formatNonRssBlogsDate(date),
            link: 그린랩스URL + slug,
        } as BlogDataType;
    });

    return dataList;
}

export async function get맘시터Data() {
    const blogData: BlogDataType[] = [];
    const 맘시터URL = "https://tech.mfort.co.kr";
    const response: AxiosResponse<string> = await axios.get(맘시터URL);

    const $root = cheerio.load(response.data);

    const elements = $root(".summary-item");

    for (let element of elements) {
        const title = $root(element).find("h2").text();
        const pubDate = $root(element).find(".text-sm").text();
        const link = 맘시터URL + $root(element).find("a").attr("href");

        blogData.push({
            title,
            link,
            pubDate: formatNonRssBlogsDate(pubDate),
        });
    }

    return blogData;
}

export async function get카카오스타일Data() {
    const blogData: BlogDataType[] = [];
    const 카카오스타일URL = "https://devblog.kakaostyle.com";
    const response: AxiosResponse<string> = await axios.get(카카오스타일URL + "/ko");

    const $root = cheerio.load(response.data);

    const elements = $root(".col-12.col-lg-9").children();

    for (let element of elements) {
        const title = $root(element).find(".posts-title a").text();
        const pubDate = $root(element).find(".posts-date").text();
        const link = 카카오스타일URL + $root(element).find(".posts-title a").attr("href");

        const baseDate = moment(pubDate, "DD MMM YYYY");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        if (title && link) {
            blogData.push({
                title,
                link,
                pubDate: parsedDate,
            });
        }
    }

    return blogData;
}

export async function get카카오페이Data() {
    const blogData: BlogDataType[] = [];
    const 카카오페이URL = "https://tech.kakaopay.com";
    const response: AxiosResponse<string> = await axios.get(카카오페이URL);

    const $root = cheerio.load(response.data);
    const elements = $root("._postList_xp5mg_34 ul").children();

    for (let element of elements) {
        const title = $root(element).find("h3").text();
        const pubDate = $root(element).find("time").text();
        const link = 카카오페이URL + $root(element).find("a").attr("href");

        const baseDate = moment(pubDate, "YYYY. M. DD");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        blogData.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return blogData;
}

export async function get쿠팡Data() {
    const blogData: BlogDataType[] = [];
    const 쿠팡URL = "https://medium.com/@coupang-engineering-kr";
    const mediumURL = "https://medium.com";
    const response: AxiosResponse<string> = await axios.get(쿠팡URL);

    const $root = cheerio.load(response.data);
    const elements = $root(".ix.l article");

    for (let element of elements) {
        const title = $root(element).find("h2").text();
        const pubDate = $root(element).find("a .bd.b.be.z.dk span").last().text();
        const link = mediumURL + $root(element).find(".ab.q a").attr("href") ?? "";

        const baseDate = moment(pubDate, "MMM DD, YYYY");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        blogData.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return blogData;
}

export async function get화해Data() {
    const blogData: BlogDataType[] = [];
    const 화해URL = "https://blog.hwahae.co.kr/category/all/tech";
    const detail화해URL = "https://blog.hwahae.co.kr/all/tech";
    const response: AxiosResponse<string> = await axios.get(화해URL);

    const $root = cheerio.load(response.data);
    const elements = $root(".e17bt4f62.css-1yjtq2.e1djbxbw1");

    for (let element of elements) {
        const title = $root(element).find(".css-smhxnw.e1djbxbw5").text();
        const pubDate = $root(element).find(".css-18pnawy.e1djbxbw6").text();
        const link = detail화해URL + $root(element).find("a").attr("href");

        const baseDate = moment(pubDate, "YYYY. MM. DD");
        const parsedDate = baseDate.format("YYYY.MM.DD");

        blogData.push({
            title,
            link,
            pubDate: parsedDate,
        });
    }

    return blogData;
}
