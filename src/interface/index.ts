export interface FeedDataType {
    title: string;
    link: string;
    pubDate: string;
}

export interface FirebaseDtoType {
    blogName: string;
    data: FeedDataType[];
}

interface GreenLabsfrontmatterType {
    title: string;
    date: string;
    slug: string;
    author: string;
    email: string;
    category: string;
    description: string;
    tags: string[];
}

export interface GreenLabsApiResponseType {
    result: {
        data: {
            allMdx: {
                nodes: { frontmatter: GreenLabsfrontmatterType }[];
            };
        };
    };
}
