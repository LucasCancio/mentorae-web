import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { deleteJob } from "@/api/jobs/delete-job";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { TJob } from "@/api/models/Job";

export interface IPostTableRowProps {
  job: TJob;
}

export function PostTableRow({ job }: IPostTableRowProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: deletePostFn, isPending: isDeletingPost } = useMutation({
    mutationFn: deleteJob,
  });

  async function handleDeletePost() {
    try {
      const { status } = await deletePostFn({ jobId: job.id });
      if (status !== 204) {
        throw new Error("Erro ao excluir post");
      }

      toast.success("Post excluído com sucesso");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    } catch (error) {
      toast.error("Erro ao excluir post");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        {job.title}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(job.updatedAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {format(job.createdAt, "dd/MM/yyyy", { locale: ptBR })}
      </TableCell>
      <TableCell className="flex gap-2">
        <Button
          onClick={() => navigate(`/job-details/${job.id}`)}
          className="bg-blue-700"
          size="xs"
          title="Editar"
        >
          <Pencil className="size-4" />
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={isDeletingPost}
              variant="destructive"
              size="xs"
              title="Excluir"
            >
              <Trash className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex flex-row">
                <TriangleAlert className="size-5 mr-2" /> Deseja realmente
                excluir esse Post?
              </DialogTitle>
              <DialogDescription hidden>
                Deseja realmente excluir esse Post?
              </DialogDescription>
            </DialogHeader>
            <p className="italic">
              Essa ação é irreversível e excluirá permanentemente o job.
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                type="button"
                onClick={handleDeletePost}
                variant="destructive"
              >
                Sim
              </Button>
              <DialogClose asChild>
                <Button className="flex-1" type="button" variant="secondary">
                  Não
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
