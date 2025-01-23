import { getProfile } from "@/api/auth/get-profile";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: 1,
    staleTime: Infinity,
  });
}
