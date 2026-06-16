import { NavLink, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { LayoutDashboard, FileText, LogOut, UserCog, Briefcase } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      //ignore
    }
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 border-r border-gray-light/60 bg-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-gray-light/60">
        <h1 className="text-base font-bold text-gray-dark tracking-tight">
          Job Tracker
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive
                ? "bg-blue/10 text-blue font-medium"
                : "text-gray-dark/70 hover:bg-gray-light/20"
            }`
          }
        >
          <LayoutDashboard />
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive
                ? "bg-blue/10 text-blue font-medium"
                : "text-gray-dark/70 hover:bg-gray-light/20"
            }`
          }
        >
          <Briefcase size={18}></Briefcase>
          Applications
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive
                ? "bg-blue/10 text-blue font-medium"
                : "text-gray-dark/70 hover:bg-gray-light/20"
            }`
          }
        >
          <UserCog size={18}/>
          Profile
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-gray-light/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-dark/70 hover:bg-gray-light/20 transition-all duration-150"
        >
          <LogOut size={18}></LogOut>
          Logout
        </button>
      </div>
    </aside>
  );
}
