import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function DriveManagement() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    // fetch drives (public route in demo backend)
    axios.get(`${API}/api/drives?active=1`).then(r=>{
      setDrives(r.data || []);
    }).catch(()=> setDrives([])).finally(()=> setLoading(false));
  },[]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Drives</h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-slate-600">Active drives: {drives.length}</div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add Drive</button>
      </div>

      {loading ? (
        <div>Loading drives…</div>
      ) : drives.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-slate-600">No drives found.</div>
      ) : (
        <div className="grid gap-4">
          {drives.map(d => (
            <div key={d.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{d.company} — {d.title}</div>
                <div className="text-sm text-slate-500">Location: {d.location} • CTC: {d.ctc}</div>
                <div className="text-sm text-slate-400">Deadline: {d.deadline}</div>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-yellow-400 text-white rounded">Edit</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
