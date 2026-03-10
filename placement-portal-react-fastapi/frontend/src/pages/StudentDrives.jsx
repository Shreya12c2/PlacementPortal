import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function StudentDrives() {
  const [drives, setDrives] = useState([]);
  const [recs, setRecs] = useState([]);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/drives?active=1`, { headers }).then((r) => setDrives(r.data));
    axios.get(`${API}/api/recommendations`, { headers }).then((r) => setRecs(r.data));
  }, []);

  const apply = async (id) => {
    try {
      await axios.post(`${API}/api/apply`, { drive_id: id }, { headers });
      alert("Applied successfully!");
    } catch (e) {
      alert(e?.response?.data?.detail || "Error applying");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Active Drives</h2>
      <div className="space-y-4">
        {drives.map((d) => (
          <div
            key={d.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex justify-between"
          >
            <div>
              <h3 className="font-medium">{d.company}</h3>
              <p className="text-sm text-gray-600">{d.title}</p>
              <p className="text-sm mt-1">
                Location: {d.location} | CTC: {d.ctc} | Deadline:{" "}
                {new Date(d.deadline).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => apply(d.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-indigo-700 mt-8 mb-4">
        Recommended For You
      </h2>
      <div className="space-y-4">
        {recs.length ? (
          recs.map((r) => (
            <div
              key={r.id}
              className="border rounded-lg p-4 bg-white shadow-sm flex justify-between"
            >
              <div>
                <h3 className="font-medium">{r.company}</h3>
                <p className="text-sm text-gray-600">{r.title}</p>
              </div>
              <button
                onClick={() => apply(r.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
