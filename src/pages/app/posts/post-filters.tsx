import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const orderFiltersSchema = z.object({
  title: z.string().optional(),
});

type TOrderFiltersSchema = z.infer<typeof orderFiltersSchema>;

export function PostFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title") || "";

  const { register, handleSubmit, reset } = useForm<TOrderFiltersSchema>({
    resolver: zodResolver(orderFiltersSchema),
    defaultValues: {
      title: title ?? "",
    },
  });

  function handleFilter({ title }: TOrderFiltersSchema) {
    setSearchParams((state) => {
      if (title) state.set("title", title);
      else state.delete("title");

      state.set("page", "1");

      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("title");
      state.set("page", "1");

      return state;
    });

    reset({
      title: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <Input
        placeholder="Pesquise por um título"
        className="h-8"
        {...register("title")}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Pesquisar
      </Button>

      <Button
        type="button"
        onClick={handleClearFilters}
        variant="outline"
        size="xs"
      >
        <Eraser className="mr-2 h-4 w-4" />
        Limpar filtro
      </Button>
    </form>
  );
}
