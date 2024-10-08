"use client"
import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Index() {
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState<string>("General");
    // const [maxLength, setMaxLength] = useState(70);
    const [author, setAuthor] = useState<string | null>(null);
    const [authorImg, setAuthorImg] = useState<string | null>(null);
    const [Loading, setLoading] = useState(false);
    const options =["Rants", "General","Spoilers","Technology", "Programming", "Lifestyle", "Entertainment"];
    const router = useRouter();
    const maxLength = 70;
    useEffect(() => {
      const storedAuthor = localStorage.getItem('author');
      const storedAuthorImg = localStorage.getItem('authorImg');
  
      if (storedAuthor) {
        setAuthor(storedAuthor);
      } else {
        toast.error('Author information not found, please refresh the page');
      }
      if (storedAuthorImg) {
        setAuthorImg(storedAuthorImg);
      } else {
        toast.error('Author image not found, please refresh the page');
      }
    }, []);
  
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value.slice(0, maxLength);
      setTitle(newTitle);
    };
      
    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = event.target.value;
      setContent(newContent);
    };
  
    function convertDriveUrlToThumbnailUrl(url: string): string {
      console.log(url);
      const match = url.match(/\/(?:file|folder)\/d\/([^\/]+)\/?(view)?/);
      if (match) {
        const fileId = match[1];
        setImage(`https://drive.google.com/thumbnail?id=${fileId}`);
        return `https://drive.google.com/thumbnail?id=${fileId}`;
      } else {
        toast.error("Invalid Google Drive URL format");
        setLoading(false);
        return "";
      }
    }
  
    const handleSubmit = async (event:ChangeEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();
      if (title.length < 5) {
        setLoading(false);
        return toast.error("Title must be at least 5 characters long");
      }
      if (content.length < 10) {
        setLoading(false);
        return toast.error("Content must be at least 10 characters long");
      }
      if (author === null || authorImg === null) {
        setLoading(false);
        return toast.error("Author information not found , please refresh the page");
      }
      let convertedImage: string = "";
      if (image) {
        const thumbnailUrl = convertDriveUrlToThumbnailUrl(image);
        if (thumbnailUrl === "") {
          return;
        }
        convertedImage = thumbnailUrl;
      }
  
      const response = await fetch("/api/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          title,
          content,
          image: convertedImage,
          author,
          authorImg,
          tags,
  
        }),
      });
      if (response.ok) {
        toast.success("Post submitted successfully");
        setLoading(false);
        router.push("/");
        setTitle("");
        setContent("");
        setImage("");
      } else {
        toast.error("due to heavy traffic, your post was not submitted");
        console.log(response,"error")
        setLoading(false);
      }
    }
  
    return (
    <Layout>
      <section className="py-3">
        <h1 className="text-3xl mb-5 text-wrap">Post Something Usefull</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 ">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title ( Min 5 characters | Max 70 characters )"
            className="border border-gray-300 hover:border-black  rounded-lg p-2 max-w-2xl"
          />
          {title.length > 0 ? <p className="text-gray-500 text-wrap font-medium">{title.length} / {maxLength}</p> : null}
          <label className="text-gray-600">Select the tag that matchs your post :</label>
          <select value={tags} onChange={(e) => setTags(e.target.value)} className="border border-gray-300 hover:border-black  rounded-lg p-2 px-4 max-w-2xl">
            {options.map((option) => (
              <option className="p-3" key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write something...(Min 10 characters)"
            className="border border-gray-300 hover:border-black whitespace-pre-line  min-h-36 rounded-lg p-2 max-w-2xl"
          ></textarea>
          {content.length > 0 ? <p className="text-gray-500 text-wrap">{content.length} letters</p> : null}
           <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL (Optional) only google drive link"
              className="border border-gray-300 hover:border-black  rounded-lg p-2 max-w-2xl"
           />
                <section className="flex flex-col ">
                  <p className="text-wrap text-red-600 font-mono  p-1">
                    1. Upload image to Google Drive. <br />
                    2. Right-click image, choose Share. <br />
                    3. Set Anyone with the link can view. <br />
                    4. Copy the link, paste here. <br />
                    5. upload only file link not folder link <br />
                    Note : Once posted , you cant edit or delete the post.
                  </p>
                </section>
         { !Loading && <button type="submit" className={`${Loading ? "bg-gray-300 hover:bg-gray-300" : "bg-blue-500"} hover:bg-blue-600 text-white py-2 px-5 text-lg lg:text-base lg:px-4 lg:p-2 rounded-xl w-fit h-fit my-5 `} >
            Post
          </button> }
          { Loading && <div className="bg-gray-300 hover:bg-gray-300 text-white py-2 px-5 text-lg lg:text-base lg:px-4 lg:p-2 rounded-xl w-fit h-fit my-5 " >
            Posting
          </div> }
        </form>
      </section>
    </Layout>
    );
  }