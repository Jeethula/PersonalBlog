"use client"
import { formatDate } from "@/utils/formatDate";
import { Comment } from "@/utils/type";
import Image from "next/image";

function CommentsComponent({ comment }: { comment: Comment }) {
    const { id, authorImg, author, createdAt, content } = comment;
    return (
        <div className="flex rounded-md  bg-slate-50 shadow-md md:w-[80%] w-full ">
           <div key={id} className="flex p-2 gap-2">
               <Image src={authorImg} alt="author"  width={40} height={40} />
                <div className="flex flex-col w-full">
                  <div className="flex gap-x-3 items-center ">
                   <h1 className="font-bold">{author}</h1>
                   <h1 className="text-gray-400 text-sm">{formatDate(createdAt)}</h1>
                  </div>
                  <div>
                   <p className="text-gray-700 text-wrap">{content}</p>
                  </div>
                </div>
                {/* <button className="w-[10%]">like</button> */}
            </div>
        </div>
    );
}

export default CommentsComponent;