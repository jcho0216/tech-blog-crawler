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

export async function sendGreetings() {
    const slackChannel = process.env.SLACK_CHANNEL_CODE ?? "";
    const slackBotToken = process.env.SLACK_BOT_TOKEN ?? "";
    const slackbot = new WebClient(slackBotToken);

    const date = moment().locale('ko').format("YYYY년 M월 D일, a h시");

    await slackbot.chat.postMessage({
        channel: slackChannel,
        text: `*${date} 기준 최신 블로그 글 목록!*`,
    });
}

export async function sendSlackMessage(blogDatas: FirebaseDtoType[]) {
    const slackChannel = process.env.SLACK_CHANNEL_CODE ?? "";
    const slackBotToken = process.env.SLACK_BOT_TOKEN ?? "";

    const { chat } = new WebClient(slackBotToken);

    for (let blogData of blogDatas) {
        const { blogName, data: feedDatas } = blogData;

        await chat.postMessage({
            channel: slackChannel,
            text: `[ *_${blogName}_* ]`,
            mrkdwn: true,
        });

        for (let feedData of feedDatas) {
            const date = feedData.pubDate;

            await chat.postMessage({
                channel: slackChannel,
                text: `∙  <${feedData.link}|${feedData.title}> (${date})`,
                mrkdwn: true,
                unfurl_links: true,
                unfurl_media: true,
            });
        }
    }
}
