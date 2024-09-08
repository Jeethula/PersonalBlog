import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function GET(req:NextApiRequest,res:NextApiResponse){
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.status(200).json(posts);
}


