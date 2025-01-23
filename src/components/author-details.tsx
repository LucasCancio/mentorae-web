import { TTeacher } from "@/api/auth/get-profile";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GraduationCap } from "lucide-react";

type Props = {
  teacher: TTeacher;
  updatedAt: string;
};

export default function AuthorDetails({ teacher, updatedAt }: Props) {
  return (
    <p className="flex flex-row gap-2 items-center text-gray-600">
      <GraduationCap className="size-6" />
      <span className="capitalize flex-1 font-medium">{teacher.name}</span>
      <span
        className="ml-auto"
        title={format(new Date(updatedAt), "dd/MM/yyyy HH:mm")}
      >
        {formatDistanceToNow(updatedAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </span>
    </p>
  );
}
