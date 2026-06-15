import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-56 flex-1 min-h-screen bg-white">
        <Outlet />
      </main>
    </div>
  );
}
