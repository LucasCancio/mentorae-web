import { Link } from "react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";
import { TMentoring } from "@/api/models/Mentoring";

type Props = {
  mentoring: TMentoring;
  showImage?: boolean;
};

export function MentoringCard({ mentoring, showImage = true }: Props) {
  return (
    <>
      {showImage && (
        <div className="w-full h-[220px] bg-white rounded-t-sm">
          {/* <img
            src={mentoring.imageUrl ?? ""}
            alt={mentoring.title}
            className="size-full object-cover rounded-t-sm"
          /> */}
        </div>
      )}
      <div className="p-4 flex flex-1 flex-col">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex-1 truncate">
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
      </div>
    </>
  );
}
