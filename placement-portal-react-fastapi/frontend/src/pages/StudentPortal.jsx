import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function StudentPortal() {
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/");

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API}/api/me/applications`, { headers }),
      axios.get(`${API}/api/drives?active=1`, { headers }),
      axios.get(`${API}/api/recommendations`, { headers }),
    ])
      .then(([apps, drives, rec]) => {
        setApplications(apps.data);
        setDrives(drives.data);
        setRecommendations(rec.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const applyDrive = async (driveId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(`${API}/api/apply`, { drive_id: driveId }, { headers });
      alert("Applied successfully!");
      window.location.reload();
    } catch (e) {
      alert(e?.response?.data?.detail || "Error applying");
    }
  };

  const withdrawDrive = async (driveId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(`${API}/api/withdraw?drive_id=${driveId}`, {}, { headers });
      alert("Withdrawn successfully!");
      window.location.reload();
    } catch (e) {
      alert(e?.response?.data?.detail || "Error withdrawing");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Topbar />
      <h2 className="text-2xl font-semibold mt-4 mb-3">My Applications</h2>
      <div className="grid gap-4">
        {applications.length ? (
          applications.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{a.company}</h3>
                <p className="text-sm text-gray-600">{a.title}</p>
                <p className="text-sm mt-1">
                  Status: <b>{a.status}</b> | Applied at:{" "}
                  {new Date(a.applied_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => withdrawDrive(a.drive_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Withdraw
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No applications yet.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Active Drives</h2>
      <div className="grid gap-4">
        {drives.length ? (
          drives.map((d) => (
            <div key={d.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{d.company}</h3>
                <p className="text-sm text-gray-600">{d.title}</p>
                <p className="text-sm mt-1">
                  Location: {d.location} | CTC: {d.ctc} | Deadline:{" "}
                  {new Date(d.deadline).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => applyDrive(d.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No active drives currently.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Recommended for You</h2>
      <div className="grid gap-4">
        {recommendations.length ? (
          recommendations.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{r.company}</h3>
                <p className="text-sm text-gray-600">{r.title}</p>
              </div>
              <button
                onClick={() => applyDrive(r.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You’ve applied to all active drives!</p>
        )}
      </div>
    </div>
  );
}
