import { getJobs } from "@/api/jobs/get-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

export function Jobs() {
  const { page, handlePaginate } = usePagination();

  const { data: result } = useQuery({
    queryKey: ["my-mentoring", page],
    staleTime: 1000 * 60 * 5,
    retry: 0,
    queryFn: () =>
      getJobs({
        page,
        perPage: 12,
      }),
  });

  return (
    <>
      <Helmet title="Posts" />

      <div className="mt-2 w-full mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
          <BriefcaseBusiness size={45} /> Vagas
        </h1>

        <div className="flex flex-wrap flex-col">
          {result?.jobs.map((job) => {
            return <JobCard job={job} key={job.id} />;
          })}
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
