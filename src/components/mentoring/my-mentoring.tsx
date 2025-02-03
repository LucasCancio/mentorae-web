import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { getMyMentoring } from "@/api/mentoring/get-my-mentoring";
import { usePagination } from "@/hooks/use-pagination";

type Props = {};

export function MyMentoring({}: Props) {
  const { page, handlePaginate } = usePagination();

  const { data: result } = useQuery({
    queryKey: ["my-mentoring", page],
    staleTime: 1000 * 60 * 5,
    retry: 0,
    queryFn: () =>
      getMyMentoring({
        page,
        perPage: 12,
      }),
  });

  return (
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
            {/*  {result &&
            result.jobs.map((post) => (
              <PostTableRow key={post.id} job={post} />
            ))} */}
          </TableBody>
        </Table>
      </div>

      {/*  {result && (
      <Pagination
        onPageChange={handlePaginate}
        pageIndex={result.meta.pageIndex}
        totalCount={result.meta.totalCount}
        perPage={result.meta.perPage}
      />
    )} */}
    </div>
  );
}
