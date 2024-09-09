"use client"
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { Post } from "@/utils/type";
import toast from "react-hot-toast";



function PostComponent({post}:{post:Post}) {

    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false)
    const [isspoiler, setIsspoiler] = useState(false);
    const [comment,setComment] = useState("");
    const [loadingPost, setLoadingPost] = useState(false);
    const [author,setAuthor] = useState("");
    const [authorImg,setAuthorImg] = useState("");
    
    function gettingLikedArray(){
 
    const likedArray = localStorage.getItem("likedArray") || "[]";
    const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
    const author = localStorage.getItem("author") || "";
    const authorImg = localStorage.getItem("authorImg") || "";
    setAuthor(author);
    setAuthorImg(authorImg);

   
    if(likedArray === "[]" ){
        localStorage.setItem("likedArray", JSON.stringify(["dummy"]));
    }
    if(dislikedArray === "[]" ){
        localStorage.setItem("dislikedArray", JSON.stringify(["dummy"]));
    }
    if(likedArray?.includes(post.id.toString())){
        setIsLiked(true);
    }
    if(dislikedArray?.includes(post.id.toString())){
        setIsDisliked(true);
    }
    }

    let likeCount = post?.like;
    let dislikeCount = post?.dilike;
    let isTimeoutActiveLike = false;
    let isTimeoutActiveDislike = false;

    const checkSpolier = ()=>{
        if(post?.tags[0] === "Spoilers"){
            setIsspoiler(true);
            }
        }

    useEffect(() => {
        gettingLikedArray();
        checkSpolier();
    } ,[]);


    const handleReadmore = ()=>{
        router.push(`/${post?.id}`);
    }

    const handleLikeClickOne = async () => {
        if (isTimeoutActiveLike) {
            return; 
          }
        isTimeoutActiveLike = true;
        setIsLiked(!isLiked);
        setIsDisliked(false); 
        setTimeout(() => {
        handleAddLike();
          isTimeoutActiveLike = false; 
        }, 1000);
    }



    const handleAddLike = async ()=>{
        if(isLiked){
            likeCount -= 1;
            setIsLiked(false);
        }
        else{
            likeCount += 1;
            setIsLiked(true);
        }
        const res = await fetch(`/api/likepost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: post?.id }),
        });
        const data = await res.json();
        if(data){
            likeCount = data.upvote;
            const likedArray = localStorage.getItem("likedArray") || "[]";
            const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
            if(dislikedArray.includes(post.id.toString())){
                dislikeCount = dislikeCount - 1;
                localStorage.setItem("dislikedArray", JSON.stringify(JSON.parse(dislikedArray).filter((id: string) => id !== post.id.toString())));
            }
            localStorage.setItem("likedArray", JSON.stringify([...JSON.parse(likedArray), post.id.toString()]));
        }
    }

    const handleDislikeClickOne = async () => {
        if (isTimeoutActiveDislike) {
            return; 
          }
        isTimeoutActiveDislike = true;
        setIsLiked(false); 
        setIsDisliked(!isDisliked);
        setTimeout(() => {
          handleAddDislike();
          isTimeoutActiveDislike = false; 
        }, 1000);
    }

    const handleAddDislike = async ()=>{
        if(isDisliked){
            dislikeCount -= 1;
            setIsDisliked(false);
        }
        else{
            dislikeCount += 1;
            setIsDisliked(true);
        }
        const res = await fetch('/api/dislikepost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: post?.id }),
        })
        const data = await res.json();
        if (data) {
            dislikeCount = data.upvote;
            const likedArray = localStorage.getItem("likedArray") || "[]";
            const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
            if(likedArray.includes(post.id.toString())){
                likeCount = likeCount - 1;
                localStorage.setItem("likedArray", JSON.stringify(JSON.parse(likedArray).filter((id: string) => id !== post.id.toString())));
            }
            localStorage.setItem("dislikedArray", JSON.stringify([...JSON.parse(dislikedArray), post.id.toString()]));
        }
    }

    const handlePostComment = async (post:Post)=>{
        if(!comment){
          toast.error("Comment cannot be empty");
          return;
        }
        setLoadingPost(true);
        try {
          const res = await fetch(`/api/addcomment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId:post?.id, content:comment,author,authorImg }),
          });
          const data = await res.json();
          if(data){
            setComment("");
            toast.success("Comment posted successfully");
            setLoadingPost(false);
          }
        } catch (error) {
          console.error("Error posting comment:", error);
          setLoadingPost(false);
        }
      }

    const tagColors: { [key: string]: string } = {
        Rants: 'red',
        General: 'blue',
        Spoilers: 'black',
        Technology: 'green',
        Programming: 'purple',
        Lifestyle: 'orange',
        Entertainment: 'brown',
    };
      const tag:string = post?.tags[0] || '';
      const backgroundColor:string = tagColors[tag] || 'gray';

    return (
        <div key={post?.id} className={`border lg:w-[70%] shadow-lg p-5 flex flex-col gap-1 rounded-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                    { post?.authorImg && <Image src={post?.authorImg} alt="author" width={40} height={40} /> }
                     <h1 className="font-semibold text-gray-500">{post?.author}</h1>
                     <h1 style={{ backgroundColor }} className={`font-bold  hidden sm:block  h-fit text-white w-fit text-sm p-1 px-2 rounded-2xl`}>{post?.tags[0]}</h1>
                </div>
                <div>
                    <h1 className="text-gray-400">{formatDate(post?.createdAt)}</h1>
                </div>
            </div>
            <hr className="mt-1" />
            <div className="p-1">
                <Link href={`/${post?.id}`} className="font-medium text-2xl hover:underline">{post?.title}</Link>
                <h1 style={{ backgroundColor }} className={`font-bold   block sm:hidden  h-fit text-white w-fit p-1 px-2 text-sm rounded-2xl`}>{post?.tags[0]}</h1>
               { post?.image &&<div className="flex justify-center"><Image src={post?.image} alt="author" width={200} height={150} /> </div> }
               {isspoiler?
               <div className=" h-56 w-full bg-black/80  rounded-md flex flex-col mt-2 ">
                <h1 className=" text-gray-300 text-lg text-center p-5">This post contains spoilers</h1>
                <button className="text-white hover:text-white/40 font-semibold flex gap-x-1 items-center justify-center" onClick={()=>{setIsspoiler(false)}}><FaEyeSlash />See Post</button>
               </div>
                :
                <div>
                <p className={`text-lg text-wrap font-sans mt-4 tracking-wide whitespace-pre-line line-clamp-4  `}>{post?.content}</p> 
                {post?.content.length > 50 && <h1 className="text-blue-700 hover:text-blue-900 underline cursor-pointer" onClick={handleReadmore}>Read more</h1>}
                </div> 
                }
            </div>
            <div className="flex flex-row justify-between mt-3 mb-2">
                <div className="flex gap-x-3">
                    <h1 className="flex items-center gap-x-2 cursor-pointer" onClick={handleLikeClickOne}> 
                    {isLiked ? <BiSolidLike fill="green" size={25} /> : <BiLike fill="green" size={25} /> } 
                    {isLiked ? likeCount + 1 : likeCount}
                    </h1>
                    <h1 className="flex items-center gap-x-2 cursor-pointer" onClick={handleDislikeClickOne}> 
                    {isDisliked ? <BiSolidDislike fill="#EF233C" size={25} />  : <BiDislike fill='#EF233C' size={25} /> } 
                    {isDisliked ? dislikeCount +1 : dislikeCount}
                    </h1>
                </div>
                <div>
                    <h1 className="cursor-pointer  text-gray-400 hover:underline" onClick={handleReadmore}>view comments</h1>
                </div>
            </div>
            <div>
                <textarea  value={comment} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>{setComment(e.target.value)}} placeholder="Add a comment" className="border-2 border-black/3 rounded-lg h-10 p-1 px-3 w-full" />
                {comment.length > 0 && !loadingPost && <button className="bg-blue-600 hover:bg-blue-700 font-semibold text-white p-1 px-3 rounded-lg mt-1" onClick={()=>handlePostComment(post)}>Comment</button>}
                {loadingPost && <h1 className="bg-gray-400 font-semibold h-fit w-fit p-1 px-3 text-black rounded-lg">Posting...</h1>}
            </div>
        </div>
    );
}

export default PostComponent;

