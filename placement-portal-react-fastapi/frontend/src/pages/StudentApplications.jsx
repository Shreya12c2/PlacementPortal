import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get(`${API}/api/me/applications`, { headers })
      .then((r) => setApplications(r.data))
      .catch((e) => console.error(e));
  }, []);

  const withdraw = async (driveId) => {
    try {
      await axios.post(`${API}/api/withdraw?drive_id=${driveId}`, {}, { headers });
      alert("Application withdrawn successfully!");
      setApplications(applications.filter((a) => a.drive_id !== driveId));
    } catch (e) {
      alert(e?.response?.data?.detail || "Error withdrawing");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">My Applications</h2>
      <div className="space-y-3">
        {applications.length ? (
          applications.map((a) => (
            <div
              key={a.id}
              className="border rounded-lg p-4 bg-white shadow-sm flex justify-between"
            >
              <div>
                <h3 className="font-medium text-lg">{a.company}</h3>
                <p className="text-gray-600 text-sm">{a.title}</p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <b
                    className={`${
                      a.status === "selected"
                        ? "text-green-600"
                        : a.status === "in_process"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {a.status}
                  </b>{" "}
                  | Applied: {new Date(a.applied_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => withdraw(a.drive_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Withdraw
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You haven’t applied to any drives yet.</p>
        )}
      </div>
    </div>
  );
}
