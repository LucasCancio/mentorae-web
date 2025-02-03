import { TStudent } from "@/api/models/Student";
import { TTeacher } from "@/api/models/Teacher";
import { getStudent } from "@/api/student/get-student";
import { getTeacher } from "@/api/teacher/get-teacher";
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
