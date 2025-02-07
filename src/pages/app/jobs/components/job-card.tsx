import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";
import { TJob } from "@/models/Job.model";
import { deleteJob } from "@/api/jobs/delete-job";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { useAuthentication } from "@/contexts/authentication-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, SquareArrowOutUpRight } from "lucide-react";
import { ExcludeConfirmationDialog } from "@/components/exclude-confirmation-dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  job: TJob;
};

export function JobCard({ job }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { userId } = useAuthentication();

  const isAuthor = job.teacher.id === userId;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutateAsync: deleteJobFn } = useMutation({
    mutationFn: deleteJob,
  });

  async function handleDelete() {
    try {
      await deleteJobFn({ jobId: job.id });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["job", job.id] }),
      ]);

      toast.success("Vaga excluida com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao excluir a vaga!");
    }
    navigate("/jobs");
  }

  return (
    <div className="rounded-md relative shadow-lg w-[380px] h-[314px] bg-card text-foreground flex flex-col py-6 px-8">
      <div className="flex flex-row justify-start gap-3">
        <img
          src={job.urlImage ?? ""}
          alt={job.company}
          title={job.company}
          className="size-20 object-cover rounded-t-sm"
        />
        <div className="flex flex-col justify-center">
          <h2
            className="text-foreground font-semibold line-clamp-2"
            title={job.title}
          >
            {job.title}
          </h2>
          <p className="text-muted-foreground truncate" title={job.company}>
            {job.company}
          </p>
        </div>
      </div>

      <table className="my-auto text-sm">
        <tbody>
          <tr>
            <td className="text-muted-foreground">Modalidade</td>
            <td>{job.modality}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground">Tipo de vaga</td>
            <td>{job.jobType}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground">Quantidade de vagas</td>
            <td>{job.quantity}</td>
          </tr>
          <tr>
            <td className="text-muted-foreground">Data de publicação</td>
            <td>
              <time>
                {capitalize(
                  formatDistanceToNow(job.publicationDate, {
                    locale: ptBR,
                    addSuffix: true,
                  })
                )}
              </time>
            </td>
          </tr>
        </tbody>
      </table>

      <Button asChild>
        <Link to={job.link} target="_blank">
          <SquareArrowOutUpRight className="mr-4" /> Se candidatar
        </Link>
      </Button>

      {isAuthor && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 size-7 p-1"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-10">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={`/job-form?id=${job.id}`}>
                  <Pencil className="mr-2 size-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ExcludeConfirmationDialog
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  onYesClick={handleDelete}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
