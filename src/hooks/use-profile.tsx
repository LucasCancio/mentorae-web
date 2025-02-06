import { getStudent } from "@/api/student/get-student";
import { getTeacher } from "@/api/teacher/get-teacher";
import { TStudent } from "@/models/Student.model";
import { TTeacher } from "@/models/Teacher.model";
import { useAuthStore } from "@/store/authStore";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useProfile(): UseQueryResult<TStudent | TTeacher, Error> {
  const { authType, userId } = useAuthStore();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () =>
      authType === "Student" ? getStudent(userId) : getTeacher(userId),
    retry: 1,
    staleTime: Infinity,
    enabled: !!userId,
  });
}
