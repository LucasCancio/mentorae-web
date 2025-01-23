import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useProfile } from "@/hooks/use-profile";

interface IAuthenticationContextType {
  isLoggedIn: boolean | null;
  isLoadingAuthentication: boolean;
  logoutProfile: () => void;
}

interface IAuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext(
  {} as IAuthenticationContextType
);

export function AuthenticationProvider({
  children,
}: IAuthenticationProviderProps) {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoadingAuthentication, setIsLoadingAuthentication] =
    useState<boolean>(true);

  function logoutProfile() {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    setIsLoadingAuthentication(isLoadingProfile);
    if (!isLoadingProfile) {
      setIsLoggedIn(!!profile);
    }
  }, [profile, isLoadingProfile]);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn,
        isLoadingAuthentication,
        logoutProfile,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  return useContext(AuthenticationContext);
}
