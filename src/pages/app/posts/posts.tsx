import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router";
import { z } from "zod";

import { getPosts } from "@/api/posts/get-posts";
import { PostFilters } from "./post-filters";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";

export function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");
  const title = searchParams.get("title");
  const content = searchParams.get("content");

  const { data: result } = useQuery({
    queryKey: ["posts", page, title, content],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      getPosts({
        page,
        title,
        content,
        perPage: 9,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());

      return state;
    });
  }

  return (
    <>
      <Helmet title="Posts" />

      <div className="flex flex-col gap-4 items-center">
        <div className="space-y-6 w-full mx-4 px-2">
          <PostFilters />
          <div className="flex flex-wrap gap-6 justify-center">
            {result?.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {result && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
