import { countLikeMentoring } from "@/api/mentoring/count-like";
import { deleteMentoring } from "@/api/mentoring/delete-mentoring";
import { likeMentoring } from "@/api/mentoring/like";
import { unlikeMentoring } from "@/api/mentoring/unlike";
import { ExcludeConfirmationDialog } from "@/components/exclude-confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/use-profile";
import { TMentoring } from "@/models/Mentoring.model";
import { TTeacher } from "@/models/Teacher.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";
import {
  Calendar,
  EllipsisVertical,
  GraduationCap,
  Heart,
  MapPin,
  Pencil,
} from "lucide-react";
import { useMemo, useState } from "react";
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
  const { data: profile } = useProfile();

  const { isMentor, isStudent, isAuthor } = useMemo(() => {
    const isTeacher = profile?.userType === "Teacher";
    let isMentor = false;
    if (isTeacher) isMentor = (profile as TTeacher).isMentored;

    return {
      isMentor,
      isStudent: !isTeacher,
      isAuthor: profile?.id === mentoring.teacher.id,
    };
  }, [profile]);

  const [likes, setLikes] = useState(mentoring.likes);
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike(unlike: boolean) {
    setIsLiking(true);
    const mentoringId = mentoring.id;
    setIsLiked((state) => !state);

    if (unlike) await unlikeMentoring({ mentoringId });
    else await likeMentoring({ mentoringId });

    const count = await countLikeMentoring({ mentoringId });
    setLikes(count);
    setIsLiking(false);
  }

  const { mutateAsync: deleteMentoringFn } = useMutation({
    mutationFn: deleteMentoring,
  });

  async function handleDelete() {
    try {
      await deleteMentoringFn({ mentoringId: mentoring.id });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mentoring-list"] }),
        queryClient.invalidateQueries({
          queryKey: ["mentoring", mentoring.id],
        }),
      ]);

      toast.success("Mentoria excluida com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao excluir a mentoria!");
    }

    navigate("/");
  }

  const whatsappLink = `https://wa.me/${mentoring.teacher.phone}?text=Olá, ${mentoring.teacher.name}! Vi sua mentoria sobre ${mentoring.matter} e gostaria de saber mais sobre.`;

  return (
    <div className="rounded-md relative shadow-lg w-[300px] h-[230px] bg-card text-foreground flex flex-col py-6 px-8 gap-4">
      <div className="flex flex-row justify-start gap-3">
        <div className="relative flex size-12 shrink-0 overflow-hidden rounded-full bg-primary text-primary-foreground justify-center items-center">
          <GraduationCap className="size-7" />
        </div>
        <div className="flex flex-col justify-center">
          <h2
            className="text-foreground font-semibold line-clamp-1 text-lg"
            title={mentoring.matter}
          >
            {mentoring.matter}
          </h2>
          <p
            className="text-muted-foreground truncate"
            title={mentoring.teacher.name}
          >
            {mentoring.teacher.name}
          </p>
        </div>
      </div>

      <time
        title="Data de mentoria"
        className="text-sm flex gap-2 items-center text-muted font-semibold"
      >
        <Calendar className="size-5" />
        {capitalize(
          format(mentoring.mentoringDate, "eeee, dd LLLL yyyy", {
            locale: ptBR,
          })
        )}
      </time>

      <span
        title="Modalidade"
        className="text-sm flex gap-2 items-center text-muted font-semibold"
      >
        <MapPin className="size-5" />
        {mentoring.modality}
      </span>

      <div className="flex justify-between mt-auto">
        <Button
          className="bg-green-500 text-white"
          asChild
          title="Entrar em contato pelo Whatsapp"
        >
          <Link to={whatsappLink} target="_blank">
            <img
              src="images/whatsapp.svg"
              className="mr-4 size-4"
              alt="Whatsapp"
            />
            Chamar
          </Link>
        </Button>
        <button
          title={
            !isStudent
              ? `${likes} curtida(s)`
              : isLiked
              ? "Descurtir"
              : "Curtir"
          }
          data-teacher={!isStudent}
          disabled={isLiking}
          className="flex gap-1 items-center text-red-500 font-semibold disabled:cursor-wait data-[teacher=true]:cursor-default"
          onClick={() => {
            if (isStudent) handleLike(isLiked);
          }}
        >
          <Heart
            data-liked={isLiked || !isStudent}
            className="hover:opacity-90 data-[liked=true]:fill-red-500 data-[liked=false]:fill-transparent transition-colors"
          />
          {likes}
        </button>
      </div>

      {isAuthor && isMentor && (
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
                <Link to={`/mentoring-form?id=${mentoring.id}`}>
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
