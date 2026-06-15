import { NavLink, useNavigate } from "react-router-dom";
import api from "../lib/api";

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
    <aside className="w-56 h-screen fixed left-0 top-0 border-r border-gray-100 bg-white flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">Job Tracker</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <span>📋</span>
          Applications
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
