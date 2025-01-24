import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router";
import { z } from "zod";

import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostTableRow } from "@/components/post-table-row";
import { getMyPosts } from "@/api/posts/get-my-posts";

export function MyMentoring() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");
  const title = searchParams.get("title");
  const content = searchParams.get("content");

  const { data: result } = useQuery({
    queryKey: ["my-posts", page, title, content],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      getMyPosts({
        page,
        title,
        content,
        perPage: 12,
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
      <Helmet title="Meus Posts" />

      <div className="flex flex-col gap-4 max-w-[800px] w-full mx-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="w-[180px]">Ultima atualização</TableHead>
                <TableHead className="w-[180px]">Cadastrado em</TableHead>
                <TableHead className="w-[132px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result &&
                result.posts.map((post) => (
                  <PostTableRow key={post.id} post={post} />
                ))}
            </TableBody>
          </Table>
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
    </>
  );
}
