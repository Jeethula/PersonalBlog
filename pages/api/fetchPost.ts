import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const post = await prisma.post.findFirst({
        where: {
            id: Number(req.body.id)
        }
    })
    return res.status(200).json(post);
}