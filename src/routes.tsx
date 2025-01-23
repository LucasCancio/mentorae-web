import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { NotFound } from "./pages/404";
import { Posts } from "./pages/app/posts/posts";
import { SignIn } from "./pages/app/auth/sign-in";
import { SignUp } from "./pages/app/auth/sign-up";
import { Error } from "./pages/error";
import { PostDetails } from "./pages/app/posts/post-details";
import { Post } from "./pages/app/posts/post";
import { MyPosts } from "./pages/app/posts/my-posts";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Posts /> },
      { path: "/post-details/:id?", element: <PostDetails /> },
      { path: "/post/:id/:slug", element: <Post /> },
      { path: "/my-posts", element: <MyPosts /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
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
