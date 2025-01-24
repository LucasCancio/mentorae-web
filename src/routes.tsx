import { AuthenticatedLayout } from "./pages/_layouts/authenticated";
import { PublicLayout } from "./pages/_layouts/public";
import { NotFound } from "./pages/404";
import { MentoringList } from "./pages/app/mentoring/mentoring-list";
import { SignIn } from "./pages/app/auth/sign-in";
import { SignUp } from "./pages/app/auth/sign-up";
import { Error } from "./pages/error";
import { MentoringDetails } from "./pages/app/mentoring/mentoring-details";
import { Mentoring } from "./pages/app/mentoring/mentoring";
import { MyMentoring } from "./pages/app/mentoring/my-mentoring";
import { createBrowserRouter } from "react-router";
import { Jobs } from "./pages/app/jobs/jobs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <MentoringList /> },
      { path: "/mentoring/details/:id?", element: <MentoringDetails /> },
      { path: "/mentoring/:id", element: <Mentoring /> },
      { path: "/my-mentoring", element: <MyMentoring /> },
      { path: "/jobs", element: <Jobs /> },
    ],
  },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
