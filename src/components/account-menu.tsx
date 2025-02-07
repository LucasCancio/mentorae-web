import {
  UserPen,
  ChevronDown,
  LogOut,
  LogIn,
  GraduationCap,
  Book,
} from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { StudentProfileDialog } from "./student-profile-dialog";
import { TeacherProfileDialog } from "./teacher-profile-dialog";
import { TTeacher } from "@/models/Teacher.model";

export function AccountMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { authType, userId } = useAuthStore();
  const { isLoggedIn, isLoadingAuthentication, logoutProfile } =
    useAuthentication();

  async function handleSignOut() {
    logoutProfile();
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    navigate("/sign-in", { replace: true });
  }

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  async function handleCloseProfileModal() {
    await queryClient.invalidateQueries({
      queryKey: ["profile", userId],
    });

    setIsProfileDialogOpen(false);
  }

  if (isLoadingAuthentication) {
    return <Skeleton className="h-4 w-40" />;
  }

  if (isLoggedIn) {
    return (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="hover:bg-primary">
            <Button
              variant="outline"
              className="flex select-none items-center gap-2 text-primary border-primary"
            >
              {isLoadingProfile ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <>
                  {profile?.userType === "Teacher" ? (
                    <GraduationCap className="size-4" />
                  ) : (
                    <Book className="size-4" />
                  )}
                  Olá {profile?.name}!
                </>
              )}
              <ChevronDown className="size-4" />
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
              onClose={handleCloseProfileModal}
              profile={profile}
            />
          )}

          {profile && authType === "Teacher" && (
            <TeacherProfileDialog
              onClose={handleCloseProfileModal}
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
