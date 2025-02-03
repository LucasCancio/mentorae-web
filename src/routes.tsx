import { AuthenticatedLayout } from "./pages/_layouts/authenticated";
import { PublicLayout } from "./pages/_layouts/public";
import { NotFound } from "./pages/404";
import { SignIn } from "./pages/app/auth/sign-in";
import { TeacherSignUp } from "./pages/app/auth/teacher-sign-up";
import { Error } from "./pages/error";
import { Mentoring } from "./pages/app/mentoring";
import { createBrowserRouter } from "react-router";
import { Jobs } from "./pages/app/jobs";
import { StudentSignUp } from "./pages/app/auth/student-sign-up";
import { SignUp } from "./pages/app/auth/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Jobs /> },
      { path: "/mentoring", element: <Mentoring /> },
    ],
  },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/sign-up-teacher", element: <TeacherSignUp /> },
      { path: "/sign-up-student", element: <StudentSignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
