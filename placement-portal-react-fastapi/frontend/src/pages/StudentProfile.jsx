import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle } from "lucide-react";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "",
    branch: "",
    cgpa: "",
    contact: "",
    skills: "",
  });
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get(`${API}/api/me`, { headers })
      .then((r) => setProfile((p) => ({ ...p, name: r.data.name })))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    alert("Profile updated successfully! (Backend integration pending)");
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert(`Uploaded resume: ${file.name}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT PROFILE CARD */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
        <UserCircle className="text-indigo-600 w-24 h-24 mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">{profile.name || "Student Name"}</h2>
        <p className="text-gray-500 text-sm">{profile.branch || "Branch not set"}</p>

        <div className="mt-6 w-full space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Drives Applied:</span> <b>5</b>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Selected:</span> <b>1</b>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Placement Rate:</span> <b>20%</b>
          </div>
        </div>

        <div className="mt-6 w-full text-center">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResume}
            className="text-sm border rounded-md px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="md:col-span-2 bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Edit Profile</h2>
        <div className="space-y-3">
          <input
            className="border rounded-md px-3 py-2 w-full"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            className="border rounded-md px-3 py-2 w-full"
            name="branch"
            value={profile.branch}
            onChange={handleChange}
            placeholder="Branch"
          />
          <input
            className="border rounded-md px-3 py-2 w-full"
            name="cgpa"
            value={profile.cgpa}
            onChange={handleChange}
            placeholder="CGPA"
          />
          <input
            className="border rounded-md px-3 py-2 w-full"
            name="contact"
            value={profile.contact}
            onChange={handleChange}
            placeholder="Contact Number"
          />
          <textarea
            className="border rounded-md px-3 py-2 w-full"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
          />
        </div>
        <button
          onClick={saveProfile}
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
