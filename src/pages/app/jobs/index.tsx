import { getJobs } from "@/api/jobs/get-jobs";
import { JobCard } from "@/pages/app/jobs/components/job-card";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const perPage = 4;

export function Jobs() {
  const { page, handlePaginate } = usePagination();

  const { data: result, isLoading } = useQuery({
    queryKey: ["jobs", page],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: () =>
      getJobs({
        page,
        limit: perPage,
      }),
  });

  return (
    <>
      <Helmet title="Posts" />

      <div className="flex flex-col mt-2 flex-1 w-full mx-auto">
        <Button
          className="mb-5 w-36 bg-green-600 flex justify-center items-center gap-2 mx-auto"
          asChild
        >
          <Link to="/job-form">
            <Plus className="size-5" />
            Criar vaga
          </Link>
        </Button>
        <div className="flex flex-wrap gap-4 flex-row justify-center">
          {!result || isLoading ? (
            <>
              <Skeleton className="h-[380px] w-[314px]" />
              <Skeleton className="h-[380px] w-[314px]" />
              <Skeleton className="h-[380px] w-[314px]" />
              <Skeleton className="h-[380px] w-[314px]" />
            </>
          ) : (
            result?.jobs.map((job) => {
              return <JobCard job={job} key={job.id} />;
            })
          )}
        </div>

        {result?.meta && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={perPage}
            totalLabel="vaga(s)"
          />
        )}
      </div>
    </>
  );
}
