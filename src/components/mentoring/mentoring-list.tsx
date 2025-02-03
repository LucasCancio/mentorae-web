import { Pagination } from "../pagination";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "@/hooks/use-pagination";
import { MentoringCard } from "./mentoring-card";
import { getMentoring } from "@/api/mentoring/get-mentoring";

export function MentoringList() {
  const { page, handlePaginate } = usePagination();

  const { data: result, isLoading } = useQuery({
    queryKey: ["mentoring", page],
    staleTime: 1000 * 60 * 5,
    retry: 0,
    queryFn: () =>
      getMentoring({
        page,
        perPage: 9,
      }),
  });

  if (!result || isLoading) {
    /* TODO: mudar para skeleton */
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6 w-full mx-4 px-2">
      <div className="flex flex-wrap gap-6 justify-center">
        {result?.mentoring?.map((mentoring) => (
          <MentoringCard key={mentoring.id} mentoring={mentoring} />
        ))}
      </div>

      {result?.meta && (
        <Pagination
          onPageChange={handlePaginate}
          pageIndex={result.meta.pageIndex}
          totalCount={result.meta.totalCount}
          perPage={result.meta.perPage}
        />
      )}
    </div>
  );
}
