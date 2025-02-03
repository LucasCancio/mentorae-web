import { useSearchParams } from "react-router";
import { z } from "zod";

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());

      return state;
    });
  }

  return {
    page,
    handlePaginate,
  };
}
