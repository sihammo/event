import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GameAdmin from "./pages/GameAdmin";
import GameLeaderboard from "./pages/GameLeaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/game",
    Component: GameAdmin,
  },
  {
    path: "/leaderboard",
    Component: GameLeaderboard,
  }
]);
