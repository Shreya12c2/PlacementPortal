import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Topbar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "student").toLowerCase();

  const handleAdminClick = async () => {
    const token = localStorage.getItem("token");
    const storedRole = (localStorage.getItem("role") || "").toLowerCase();

    // ✅ If already admin with token, just navigate
    if (token && storedRole === "admin") {
      navigate("/admin/drives");
      return;
    }

    // 🚀 Otherwise, request demo admin token and login automatically
    try {
      const API = import.meta.env.VITE_API || "http://localhost:8000";
      const res = await axios.get(`${API}/api/demo-login`, { params: { role: "admin" } });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/admin/drives");
    } catch (error) {
      console.error("Admin login failed:", error);
      alert("Unable to access admin panel. Please log in as admin.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-xl font-bold text-indigo-700">Placement Portal</div>

      <div className="flex items-center gap-4">
        {/* 🔹 Admin Panel button visible to all for quick access */}
        <button
          onClick={handleAdminClick}
          className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Admin Panel
        </button>

        <div className="text-sm text-slate-600">
          Logged in as <b>{role}</b>
        </div>

        <button
          onClick={handleLogout}
          className="ml-3 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
