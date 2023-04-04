import * as crawler from "./crawlers";

async function main() {
    const withRSSBlogData = await crawler.getTechBlogDataWithRSS();
    const withoutRSSBlogData = await crawler.getTechBlogDataWithoutRSS();

    const BlogData = [...withRSSBlogData, ...withoutRSSBlogData];

    console.log(BlogData);
}

main();
