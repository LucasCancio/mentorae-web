import { getJobs } from "@/api/jobs/get-jobs";
import { JobCard } from "@/pages/app/jobs/components/job-card";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const perPage = 12;

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

      <div className="mt-2 w-full mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
          <BriefcaseBusiness size={45} /> Vagas
        </h1>

        <Button variant="success" asChild>
          <Link to="/job-form">Criar</Link>
        </Button>

        {!result || isLoading ? (
          <div>Carregando...</div>
        ) : (
          <div>
            <div className="flex flex-wrap flex-col">
              {result?.jobs.map((job) => {
                return <JobCard job={job} key={job.id} />;
              })}
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
        )}
      </div>
    </>
  );
}
