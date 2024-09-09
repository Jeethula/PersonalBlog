import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";

export default async function POST(req:NextApiRequest,res:NextApiResponse){
    try{
    const comments = await prisma.comment.findMany({
        where:{
            postId:Number(req.body.id)
        }
    })
    return res.status(200).json(comments)
}catch(e){
    console.log(e)
    return res.status(500).json({error:"Internal Server Error"})
}
}