"use client"
import { useEffect, useState } from "react";
import Layout from "../layout";
import { Post } from "@/utils/type";
import PostComponent from "@/components/PostComponent";

function Index() {
  const options = ["General", "Rants", "Spoilers", "Technology", "Programming", "Lifestyle", "Entertainment"];
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [selectedOption, setSelectedOption] = useState("General");
  const [search, setSearch] = useState("");
  const [IsSearch,setIsSearch] = useState(false);

  const getPosts = async () => {
    const res = await fetch("/api/fetchPosts");
    const fetchedPosts = await res.json();
    setPosts(fetchedPosts);
    return fetchedPosts;
  }

  const showPosts = (option: string, allPosts: Post[]) => {
    const filteredPosts = allPosts.filter((post: Post) => post?.tags[0] === option);
    setSelectedPosts(filteredPosts);
  }

  useEffect(() => {
    if(search.length > 0){
      const filteredPosts = posts.filter((post: Post) => post?.title.toLowerCase().includes(search.toLowerCase()));
      setSelectedPosts(filteredPosts);
    }
  }, [search]);

  useEffect(() => {
    getPosts().then((fetchedPosts) => {
      showPosts("General", fetchedPosts);
    });
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    showPosts(option, posts);
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl mt-2 mb-2 text-wrap">Read posts about specific tags,</h1>
        <input type="text" placeholder="Search Posts by their title" className="h-8 md:w-[500px] w-full p-3 border rounded-lg" onChange={(e)=>{setSearch(e.target.value)}} onFocus={()=>{setIsSearch(true)}} onBlur={()=>{setIsSearch(false),setSearch("")}} />
       { !IsSearch && search.length === 0 && <div className="flex overflow-x-auto scrollbar">
          {options.map((option) => (
            <div
              key={option}
              className={`${selectedOption === option ? "bg-gray-300" : "bg-gray-100"} p-2 mr-2 mt-2 font-semibold rounded-md cursor-pointer hover:text-white hover:bg-gray-400`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>}
        <div>
          {selectedPosts.length === 0 && !IsSearch && <h1 className="text-2xl mt-5 text-wrap text-gray-500">No posts found on this tag. </h1>}
          {selectedPosts.length === 0 && IsSearch && <h1 className="text-2xl mt-5 text-wrap text-gray-500">No posts found  </h1>}
          {selectedPosts.map((post: Post) => (
            <div key={post.id} className="mt-5">
              <PostComponent post={post} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Index;