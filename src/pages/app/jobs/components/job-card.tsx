import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";
import { TJob } from "@/models/Job.model";
import { deleteJob } from "@/api/jobs/delete-job";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { useAuthentication } from "@/contexts/authentication-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { ExcludeConfirmationDialog } from "@/components/exclude-confirmation-dialog";
import { useState } from "react";

type Props = {
  job: TJob;
};

export function JobCard({ job }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { userId } = useAuthentication();

  const isAuthor = job.teacher.id === userId;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function handleDelete() {
    await deleteJob({ jobId: job.id });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["job", job.id] }),
    ]);

    toast.success("Vaga excluida com sucesso!");
    navigate("/jobs");
  }

  return (
    <div className="rounded-md shadow-md min-h-[380px] w-[400px] border-[1px] bg-background text-foreground flex flex-col hover:transform hover:scale-105 transition-transform">
      <div className="w-full h-[220px] bg-white rounded-t-sm">
        <img
          src={job.urlImage ?? ""}
          alt={job.title}
          className="size-full object-cover rounded-t-sm"
        />
      </div>
      <div className="p-4 flex flex-1 flex-col">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex-1 truncate">{job.title}</h2>
        </div>
        <time>
          {capitalize(
            format(new Date(job.publicationDate), "eeee, dd LLLL yyyy", {
              locale: ptBR,
            })
          )}
        </time>
      </div>
      {isAuthor && (
        <div className="flex gap-4">
          <Button asChild>
            <Link to={`/job-form?id=${job.id}`}>
              <SquareArrowOutUpRight /> Editar
            </Link>
          </Button>
          <ExcludeConfirmationDialog
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            onYesClick={handleDelete}
            isDeleting={false}
          />
        </div>
      )}
    </div>
  );
}
