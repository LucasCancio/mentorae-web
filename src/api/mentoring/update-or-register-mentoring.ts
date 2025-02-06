import { api } from "@/lib/axios";

export interface ISaveMentoringBody {
  mentoringId?: number;
  modality: string;
  matter: string;
  mentoring_date: string;
  teacher_id: number;
}

export async function updateOrRegisterMentoring({
  mentoringId,
  mentoring_date,
  modality,
  matter,
  teacher_id,
}: ISaveMentoringBody) {
  if (mentoringId) {
    return await api.put(`/mentoring/${mentoringId}`, {
      mentoring_date,
      modality,
      matter,
      teacher_id,
    });
  }

  return await api.post("/mentoring", {
    mentoring_date,
    modality,
    matter,
    teacher_id,
  });
}
