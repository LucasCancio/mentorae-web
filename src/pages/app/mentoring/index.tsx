import { Helmet } from "react-helmet-async";
import { getMentoringList } from "@/api/mentoring/get-mentoring-list";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { MentoringCard } from "./components/mentoring-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useMemo } from "react";
import { TTeacher } from "@/models/Teacher.model";

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

  const { data: profile } = useProfile();

  const { isMentor } = useMemo(() => {
    const isTeacher = profile?.userType === "Teacher";
    let isMentor = false;
    if (isTeacher) isMentor = (profile as TTeacher).isMentored;

    return {
      isMentor,
    };
  }, [profile]);

  return (
    <>
      <Helmet title="Mentorias" />

      <div className="flex flex-col mt-2 flex-1 w-full mx-auto">
        {isMentor && (
          <Button
            className="mb-5 w-36 bg-green-600 flex justify-center items-center gap-2 mx-auto"
            asChild
          >
            <Link to="/mentoring-form">
              <Plus className="size-5" />
              Criar mentoria
            </Link>
          </Button>
        )}
        <div className="flex flex-wrap gap-4 flex-row justify-center">
          {!result || isLoading ? (
            <>
              <Skeleton className="w-[300px] h-[300px]" />
              <Skeleton className="w-[300px] h-[300px]" />
              <Skeleton className="w-[300px] h-[300px]" />
              <Skeleton className="w-[300px] h-[300px]" />
            </>
          ) : (
            result?.mentoring.map((mentoring) => {
              return <MentoringCard key={mentoring.id} mentoring={mentoring} />;
            })
          )}
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
    </>
  );
}
