import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // ✅ Updated redirect logic
  const redirectByRole = (role) => {
    if (role === "admin") {
      window.location.href = "/admin/drives";
    } else if (role === "student") {
      window.location.href = "/student";
    } else {
      window.location.href = "/dashboard";
    }
  };

  const goDemo = async (role) => {
    try {
      const res = await axios.get(`${API}/api/demo-login`, { params: { role } });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || role);
      redirectByRole(res.data.role);
    } catch (e) {
      setError(e?.response?.data?.detail || "Unable to start demo");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API}/api/login`, { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name || "");
      redirectByRole(data.role);
    } catch (e) {
      setError(e?.response?.data?.detail || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API}/api/register`, regData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name || regData.name);
      setShowRegister(false);
      redirectByRole(data.role);
    } catch (e) {
      setError(e?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card w-[520px]">
        <h1 className="text-3xl font-bold text-center">Placement Portal</h1>
        <p className="text-center text-slate-500 mt-1">
          College Placement Management System
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full border rounded-md px-3 py-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded-md px-3 py-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary" type="submit">
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Demo Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => goDemo("student")}
            className="w-full rounded-md px-4 py-3 font-medium text-white bg-indigo-600"
          >
            Demo Student
          </button>
          <button
            onClick={() => goDemo("admin")}
            className="w-full rounded-md px-4 py-3 font-medium text-white bg-green-600"
          >
            Demo Admin
          </button>
          <button
            onClick={() => goDemo("recruiter")}
            className="w-full rounded-md px-4 py-3 font-medium text-white bg-purple-600"
          >
            Demo Recruiter
          </button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-slate-600">
            First time here?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-indigo-600 hover:underline"
            >
              Register
            </button>
          </p>
        </div>

        {showRegister && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[420px]">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Register New User
              </h2>
              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Full Name"
                  value={regData.name}
                  onChange={(e) =>
                    setRegData({ ...regData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Email"
                  value={regData.email}
                  onChange={(e) =>
                    setRegData({ ...regData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Password"
                  value={regData.password}
                  onChange={(e) =>
                    setRegData({ ...regData, password: e.target.value })
                  }
                />
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={regData.role}
                  onChange={(e) =>
                    setRegData({ ...regData, role: e.target.value })
                  }
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
