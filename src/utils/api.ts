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


export async function sendGreetings(token: string, channel: string) {
    const slackbot = new WebClient(token);

    await slackbot.chat.postMessage({
        channel,
        text: `*“모두가 함께 앞으로 나아가면 성공은 저절로 따라옵니다.” — 미국 기업가이자 Ford Motor Company 창립자 Henry Ford*`,
        mrkdwn: true,
        unfurl_links: true,
    });
}

export async function sendSlackMessage(token: string, channel: string, data: FeedDataType[]) {
    data.map(async (feedData) => {
        const baseDate = moment(feedData.pubDate, "YYYY.MM.DD");
        const parsedDate = baseDate.format("YYYY년 MM월 DD일");
    
        const slackbot = new WebClient(token);
    
        await slackbot.chat.postMessage({
            channel,
            text: ` \n제목 : *${feedData.title}* \n날짜 : ${parsedDate}\n링크 : <${feedData.link}|글 보러가기>`,
            mrkdwn: true,
            unfurl_links: true,
        });
    });
   
}