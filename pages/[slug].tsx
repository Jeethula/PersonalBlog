"use client"
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
import CommentsComponent from "@/components/CommentsComponent";
import toast from "react-hot-toast";
import LoadingPageUi from "@/components/LoadingPageUi";
import { Comment }from "@/utils/type";
import { Post } from "@/utils/type";

function PostPage() {
  const pathname = usePathname();
  const [postId, setPostId] = useState<string |null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [data, setData] = useState<Post>({"id":0,"title":"","image":"","content":"","like":0,"dilike":0,"author":"","authorImg":"","createdAt":"","tags":[]});
  const [comment,setComment] = useState<string>("");
  const [author,setAuthor] = useState<string>("");
  const [authorImg,setAuthorImg] = useState<string>("");
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false)
  const [isLoading , setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  function gettingLikedArray(){
    const likedArray = localStorage.getItem("likedArray") || "[]";
    const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
   
    if(likedArray === "[]" ){
        localStorage.setItem("likedArray", JSON.stringify(["dummy"]));
    }
    if(dislikedArray === "[]" ){
        localStorage.setItem("dislikedArray", JSON.stringify(["dummy"]));
    }
    if(data?.id !== null && data?.id !== undefined){
    if(likedArray?.includes(data?.id.toString())){
        setIsLiked(true);
    }
    if(dislikedArray?.includes(data?.id.toString())){
        setIsDisliked(true);
    }
   }
    }

    let likeCount = data?.like;
    let dislikeCount = data?.dilike;
    let isTimeoutActiveLike = false;
    let isTimeoutActiveDislike = false;
    

    useEffect(() => {
        gettingLikedArray();
    }
    , [likeCount, dislikeCount]);

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
        const response = await fetch(`/api/likepost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: data?.id }),
        });
        const datares = await response.json();
        if(datares){
            likeCount = datares.upvote;
            const likedArray = localStorage.getItem("likedArray") || "[]";
            const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
            if(dislikedArray.includes(datares.id.toString())){
                dislikeCount = dislikeCount - 1;
                localStorage.setItem("dislikedArray", JSON.stringify(JSON.parse(dislikedArray).filter((id: string) => id !== datares.id.toString())));
            }
            localStorage.setItem("likedArray", JSON.stringify([...JSON.parse(likedArray), datares.id.toString()]));
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
        const response2 = await fetch('/api/dislikepost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: data?.id }),
        })
        const datares = await response2.json();
        if (datares) {
            dislikeCount = datares.upvote;
            const likedArray = localStorage.getItem("likedArray") || "[]";
            const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
            if(likedArray.includes(datares.id.toString())){
                likeCount = likeCount - 1;
                localStorage.setItem("likedArray", JSON.stringify(JSON.parse(likedArray).filter((id: string) => id !== datares.id.toString())));
            }
            localStorage.setItem("dislikedArray", JSON.stringify([...JSON.parse(dislikedArray), datares.id.toString()]));
        }
    }

  useEffect(() => {
    if (pathname) {
      const id = pathname.slice(1);
      setPostId(id);
      fetchPost(id);
      fetchComments(id);
      const authorLoc = localStorage.getItem("author");
      const authorImgLoc = localStorage.getItem("authorImg");
      setAuthor(authorLoc || "");
      setAuthorImg(authorImgLoc || "");
    }
  }, [pathname]);

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`/api/fetchPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      const res = await fetch(`/api/fetchComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setComments(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  if(Object.keys(data).length === 0 || postId === null || !postId || !data || !comments){
    return <div><LoadingPageUi /></div>;
  }

  if(isLoading){
    return <div><LoadingPageUi /></div>;
  }



  const handlePostComment = async ()=>{
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
        body: JSON.stringify({ postId, content:comment,author,authorImg }),
      });
      const data = await res.json();
      if(data){
        fetchComments(postId);
        setComment("");
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
  const tag:string = data?.tags[0] || '';
  const backgroundColor:string = tagColors[tag] || 'gray';


  return (
    <main> 
    { !data || !comments || !postId || Object.keys(data).length === 0  ? <div><LoadingPageUi /></div> :
    <div className="lg:w-[55%] lg:p-10 p-5 lg:mx-60  ">
    <h1 className="hover:underline text-blue-700 text-2xl cursor-pointer flex gap-x-2 items-center " onClick={()=>router.push("/")}><IoMdArrowRoundBack /> back to posts</h1>
      <div className="flex flex-col gap-y-3 mt-5 w-full">
      <div className="flex items-center gap-x-5"> 
        <div className="flex items-center gap-x-2">
        { data?.authorImg &&  <Image src={data?.authorImg} alt="author" width={50} height={50} />}
          <h1 className="font-semibold">{data?.author}</h1>
        </div>
         <h1 className="text-gray-400 font-semibold"> {formatDate(data?.createdAt)}</h1> 
         <h1 style={{ backgroundColor }} className={`font-bold h-fit hidden sm:block text-white w-fit p-1 px-2 text-sm rounded-2xl`}>{data?.tags[0]}</h1>
         </div>
        <h1 className="font-bold text-3xl">{data?.title}</h1>
        <h1 style={{ backgroundColor }} className={`font-bold h-fit sm:hidden  text-white w-fit p-1 px-2 text-sm rounded-2xl`}>{data?.tags[0]}</h1>
       { data?.image && <Image src={data?.image} alt={data?.title} width={200} height={150} />}
        <p className="text-xl font-sans tracking-wide whitespace-pre-line mt-4 bg-slate-50 p-5 rounded-lg text-wrap w-fit">{data?.content}</p>
        <div className="flex items-center justify-between md:w-[80%] w-full">
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
              <h1  className="flex gap-x-2 text-gray-400 font-semibold">{comments?.length} Comments</h1>
            </div>
        </div>
        <div className="mt-2 flex md:flex-row flex-col gap-x-5  md:items-center gap-y-5">
            <textarea value={comment} onChange={(e)=>setComment(e.target.value)}  placeholder="Add a comment" className="sm:h-16 h-24 border rounded-md p-3 md:w-[80%] w-full" />
           { loadingPost ?
              <button className="h-fit w-fit p-2 px-3 bg-gray-500  rounded-lg font-bold text-white border-blue-400 "> Posting</button> :
              comment.length>0 && <button onClick={handlePostComment} className="h-fit w-fit p-2 px-3 bg-blue-500 hover:bg-blue-700 rounded-lg font-bold text-white border-blue-400 ">+ Post</button> }
        </div>
        <div className="mt-5">
          <h1 className="font-semibold text-2xl">Comments </h1>
          <div className="flex flex-col gap-y-3 mt-3">
            {comments && comments?.length === 0 && <h1 className="text-gray-500 text-lg">No comments yet</h1>}
            {comments && comments.map((comment: Comment) => (
                <CommentsComponent key={comment.id} comment={comment} />
            ))}
          </div>
        </div>

      </div>
    </div>
    }
    </main>
  );
}

export default PostPage;
