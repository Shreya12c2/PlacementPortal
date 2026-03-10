import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-700">Admin Panel</h2>
          <div className="text-sm text-slate-500 mt-1">Logged in as <b>{role || 'admin'}</b></div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/drives" className={({isActive})=>isActive? "px-3 py-2 rounded bg-indigo-100":"px-3 py-2 rounded hover:bg-indigo-50"}>📋 Drives</NavLink>
          <NavLink to="/admin/reports" className={({isActive})=>isActive? "px-3 py-2 rounded bg-indigo-100":"px-3 py-2 rounded hover:bg-indigo-50"}>📈 Reports</NavLink>
          <NavLink to="/admin/announcements" className={({isActive})=>isActive? "px-3 py-2 rounded bg-indigo-100":"px-3 py-2 rounded hover:bg-indigo-50"}>📢 Announcements</NavLink>
        </nav>

        <div className="mt-6">
          <button onClick={handleLogout} className="w-full bg-red-500 text-white px-3 py-2 rounded">Logout</button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
