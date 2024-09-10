import { useState } from 'react';
import Layout from "./layout";
import type { InferGetServerSidePropsType } from 'next';
import prisma from '@/utils/prisma';
import PostComponent from "@/components/PostComponent";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const POSTS_PER_PAGE = 5;

export const getServerSideProps = async ({ query }:{ query: Record<string, string> }) => {

  const page = Number(query.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: POSTS_PER_PAGE,
      skip: skip,
    }),
    prisma.post.count(),
  ]);

  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    image: post.image,
    content: post.content,
    like: post.like,
    dilike: post.dilike,
    authorImg: post.authorImg,
    author: post.author,
    tags: post.tags,
    createdAt: post.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return { props: { data, currentPage: page, totalPages } };
};

export default function Home({
  data,
  currentPage,
  totalPages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  const [posts] = useState(data);

  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={`/?page=${i}`} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-lg sm:text-xl md:text-3xl text-wrap mt-2 mb-4 first-letter:tracking-widest first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:float-left">
          A safe place for open discussion, <br />anonymity is guaranteed.
        </h1>
        {posts.map((post) => (
          <div className="py-3" key={post?.id}>
            <PostComponent post={post} key={post.id} />
          </div>
        ))}
        <Pagination className='mt-3 mb-8'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`/?page=${Math.max(1, currentPage - 1)}`} />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext href={`/?page=${Math.min(totalPages, currentPage + 1)}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Layout>
  );
}