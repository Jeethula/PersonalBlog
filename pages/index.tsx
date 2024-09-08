import Layout from "./layout";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import prisma from '@/utils/prisma';
import PostComponent from "@/components/PostComponent";


export const getServerSideProps = (async () => {

  const fetchPosts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
  })

  const data = fetchPosts.map((post) => {
    return {
      id: post.id,
      title: post.title,
      image: post.image,
      content: post.content,
      like: post.like,
      dilike: post.dilike,
      authorImg: post.authorImg,
      author: post.author,
      tags: post.tags,
      createdAt: (post.createdAt).toISOString(),
      }})
  return {props: {data}}
}) 



export default function Home({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <Layout>
      <div className="container">
      <h1 className="text-lg sm:text-xl md:text-3xl text-wrap mt-2 mb-4 first-letter:tracking-widest first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:float-left">A safe place for open discussion, <br />nonymity is guaranteed.</h1>
       {
        data.map((post: any) => (
          <div className="py-3">
          <PostComponent post={post} key={post.id}/>
          </div>
        ))
       }
      </div>
    </Layout>
  );
}
