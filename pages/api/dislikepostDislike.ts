import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try{
    const post = await prisma.post.update({
        data: {
            dilike: {
                decrement: 1
            }
        },
        where: {
            id: Number(req.body.id)
        }})
    return res.status(200).json(post);
    }catch(e){
        console.log(e)
        return res.status(500).json({error:"Internal Server Error"})
    }
}