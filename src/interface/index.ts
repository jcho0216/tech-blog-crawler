export interface BlogDataType {
    title: string;
    link: string;
    pubDate: string;
}

interface 그린랩스frontmatterType {
    title: string;
    date: string;
    slug: string;
    author: string;
    email: string;
    category: string;
    description: string;
    tags: string[];
}

export interface 그린랩스Type {
    result: {
        data: {
            allMdx: {
                nodes: { frontmatter: 그린랩스frontmatterType }[];
            };
        };
    };
}

