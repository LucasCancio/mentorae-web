import { countLikeMentoring } from "@/api/mentoring/count-like";
import { deleteMentoring } from "@/api/mentoring/delete-mentoring";
import { likeMentoring } from "@/api/mentoring/like";
import { unlikeMentoring } from "@/api/mentoring/unlike";
import { ExcludeConfirmationDialog } from "@/components/exclude-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/contexts/authentication-context";
import { TMentoring } from "@/models/Mentoring.model";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";
import { SquareArrowOutUpRight, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type Props = {
  mentoring: TMentoring;
};

export function MentoringCard({ mentoring }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(mentoring.hasLiked);
  const { userId, userType } = useAuthentication();

  const isAuthor = mentoring.teacher.id === userId;
  const isTeacher = userType === "Teacher";

  const [likes, setLikes] = useState(mentoring.likes);

  async function handleLike(unlike: boolean) {
    const mentoringId = mentoring.id;
    setIsLiked((state) => !state);

    if (unlike) await unlikeMentoring({ mentoringId });
    else await likeMentoring({ mentoringId });

    const count = await countLikeMentoring({ mentoringId });
    setLikes(count);
  }

  async function handleDelete() {
    await deleteMentoring({ mentoringId: mentoring.id });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["mentoring-list"] }),
      queryClient.invalidateQueries({ queryKey: ["mentoring", mentoring.id] }),
    ]);

    toast.success("Mentoria excluida com sucesso!");
    navigate("/");
  }

  return (
    <div className="p-4 flex flex-1 flex-col border-2 rounded-lg shadow-md">
      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-xl font-semibold flex-1 truncate">
          {mentoring.matter}
        </h2>
        <h2 className="text-lg font-semibold flex-1 truncate">
          {mentoring.modality}
        </h2>
      </div>
      <time>
        {capitalize(
          format(new Date(mentoring.mentoringDate), "eeee, dd LLLL yyyy", {
            locale: ptBR,
          })
        )}
      </time>
      {isAuthor && (
        <div className="flex gap-4">
          <Button asChild>
            <Link to={`/mentoring-form?id=${mentoring.id}`}>
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
      {!isTeacher && (
        <div>
          <p>{likes} curtidas</p>
          <Button onClick={() => handleLike(isLiked)}>
            {isLiked ? (
              <>
                <X /> Descurtir
              </>
            ) : (
              <>
                <ThumbsUp /> Curtir
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
