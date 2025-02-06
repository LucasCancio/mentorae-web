import { Helmet } from "react-helmet-async";
import { Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { getMentoringList } from "@/api/mentoring/get-mentoring-list";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { MentoringCard } from "./components/mentoring-card";

const perPage = 4;

export function Mentoring() {
  const { page, handlePaginate } = usePagination();

  const { data: result, isLoading } = useQuery({
    queryKey: ["mentoring-list", page],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: () =>
      getMentoringList({
        page,
        limit: perPage,
      }),
  });

  return (
    <>
      <Helmet title="Mentorias" />

      <div className="mt-2 w-full mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
          <Presentation size={45} /> Mentorias
        </h1>

        <Button variant="success" asChild>
          <Link to="/mentoring-form">Criar</Link>
        </Button>

        {!result || isLoading ? (
          <div>Carregando...</div>
        ) : (
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
                perPage={perPage}
                totalLabel="mentoria(s)"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
