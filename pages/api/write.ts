import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/utils/prisma";


export default async function POST(req : NextApiRequest, res : NextApiResponse) {
    //  const token = req.headers["Authorization"];
//     console.log("entering",token)
//   if (token!== `Bearer ${process.env.TOKEN_SECRET}`) {
//         return res.status(401).json({ error: "Unauthorized" });
//     }
try{
    const body = await req.body;
    const { title, content, image, author, authorImg,tags }  = body
    const post = await prisma.post.create({
        data: {
            title,
            content,
            image,
            author,
            authorImg,
            tags:[tags],
        },
    });
    return res.status(200).json(post);
}catch(e){
    console.log(e)
    return res.status(500).json({error:"Internal Server Error"})
}
}
