import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("eeeeeeeee")
    const post = await prisma.post.findFirst({
        where: {
            id: Number(req.body.id)
        }
    })
    console.log("333333")
    return res.status(200).json(post);
}