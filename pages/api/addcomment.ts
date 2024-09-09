import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default  async function POST(req:NextApiRequest,res:NextApiResponse){
    const body = await req.body;
    const {content,author,authorImg,postId} = body;
    const comment = await prisma.comment.create({
        data:{
            content,
            author,
            authorImg,
            postId:Number(postId)
        }
    })
    return res.status(200).json(comment)
}