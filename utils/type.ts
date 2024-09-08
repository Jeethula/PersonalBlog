export interface Post {
    id: number;
    title: string;
    image: string;
    content: string;
    like: number;
    dilike: number;
    author: string;
    authorImg: string;
    createdAt: string;
    comments: Comment[];
    tags: string[];
}
