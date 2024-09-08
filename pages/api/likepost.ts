import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const post = await prisma.post.update({
        data: {
            like: {
                increment: 1
            }
        },
        where: {
            id: Number(req.body.id)
        }})
    return res.status(200).json(post);
}