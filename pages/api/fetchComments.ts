import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req:NextApiRequest,res:NextApiResponse){
    const comments = await prisma.comment.findMany({
        where:{
            postId:Number(req.body.id)
        }
    })
    return res.status(200).json(comments)
}