import { WebClient } from "@slack/web-api";
import { FeedDataType, FirebaseDtoType } from "../interface";
import moment from "moment";

export async function getBlogDatas(firestore: FirebaseFirestore.Firestore) {
    const documentSnapshots = await firestore.collection("blogs").get();

    const blogData = documentSnapshots.docs.map((value) => {
        const blogName: string = value.id;
        const data: FeedDataType[] = value.data().data;

        return { blogName, data } as FirebaseDtoType;
    });

    return blogData;
}

export async function postBlogDatas(firestore: FirebaseFirestore.Firestore, data: FirebaseDtoType[]) {
    const requests = data.map((value) => {
        return firestore.collection("blogs").doc(value.blogName).set({ data: value.data });
    });

    await Promise.allSettled([...requests]);
}

export async function sendSlackMessage(blogDatas: FirebaseDtoType[]) {
    const slackChannel = process.env.SLACK_CHANNEL_CODE ?? "";
    const slackBotToken = process.env.SLACK_BOT_TOKEN ?? "";

    const { chat } = new WebClient(slackBotToken);

    const date = moment().locale("ko").format("YYYY년 M월 D일, a h시");

    let message = `*${date} 기준 최신 블로그 글 목록!*\n`;

    for (let blogData of blogDatas) {
        const { blogName, data: feedDatas } = blogData;

        message += `\n*_${blogName}_*`;

        for (let feedData of feedDatas) {
            const date = feedData.pubDate;
            message += `\n∙  <${feedData.link}|${feedData.title}> (${date})\n`;
        }
    }

    await chat.postMessage({
        channel: slackChannel,
        text: message,
        mrkdwn: true,
        unfurl_links: false,
        unfurl_media: false,
    });
}
