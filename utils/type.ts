export type Post = {
    id: number;
    title: string;
    image: string|null;
    content: string;
    like: number;
    dilike: number;
    author: string;
    authorImg: string | null;
    createdAt: string;
    tags: string[];
}

export interface Comment {
    id:number
    content:string
    author:string
    authorImg:string 
    createdAt:string
    postId:number
    likeCount:number
}

