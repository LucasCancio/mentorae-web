import { UserPen, ChevronDown, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useAuthentication } from "@/contexts/authentication-context";
import { useState } from "react";
import { logout } from "@/api/auth/logout";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { StudentProfileDialog } from "./student-profile-dialog";
import { TeacherProfileDialog } from "./teacher-profile-dialog";
import { TTeacher } from "@/api/models/Teacher";

export function AccountMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { authType } = useAuthStore();
  const { isLoggedIn, isLoadingAuthentication, logoutProfile } =
    useAuthentication();

  async function handleSignOut() {
    await logout();
    logoutProfile();
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    navigate("/sign-in", { replace: true });
  }

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  if (isLoadingAuthentication) {
    return <Skeleton className="h-4 w-40" />;
  }

  if (isLoggedIn) {
    return (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex select-none items-center gap-2"
            >
              {isLoadingProfile ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <> Olá {profile?.name}!</>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              {isLoadingProfile ? (
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : (
                <>
                  <span>{profile?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {profile?.email}
                  </span>
                </>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {isLoadingProfile ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              isLoggedIn && (
                <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                  <UserPen className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuItem
              asChild
              className="text-rose-500 dark:text-rose-400"
            >
              <button className="w-full" onClick={() => handleSignOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog
          open={isProfileDialogOpen}
          onOpenChange={(open) => setIsProfileDialogOpen(open)}
        >
          {profile && authType === "Student" && (
            <StudentProfileDialog
              onClose={() => setIsProfileDialogOpen(false)}
              profile={profile}
            />
          )}

          {profile && authType === "Teacher" && (
            <TeacherProfileDialog
              onClose={() => setIsProfileDialogOpen(false)}
              profile={profile as TTeacher}
            />
          )}
        </Dialog>
      </>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => navigate("/sign-in")}
      className="flex select-none items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      Entrar
    </Button>
  );
}
