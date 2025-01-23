import "./global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { ThemeProvider } from "./components/theme/theme-provider";
import { queryClient } from "./lib/react-query";
import { router } from "./routes";
import { AuthenticationProvider } from "./contexts/authentication-context";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="fiaposts-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | fiaposts" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <AuthenticationProvider>
            <RouterProvider router={router} />
          </AuthenticationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
