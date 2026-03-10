import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function StudentDashboardLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links = [
    { name: "My Applications", path: "applications" },
    { name: "Active Drives", path: "drives" },
    { name: "Profile", path: "profile" },
    { name: "Interview Prep", path: "interview-prep" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 shadow-md flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h1 className={`text-xl font-bold text-indigo-600 ${!open && "hidden"}`}>
            Placement Portal
          </h1>
          <button onClick={() => setOpen(!open)} className="text-indigo-600">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-indigo-50 ${
                  isActive ? "text-indigo-600 bg-indigo-100" : "text-gray-700"
                }`
              }
            >
              {open && l.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="m-4 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
