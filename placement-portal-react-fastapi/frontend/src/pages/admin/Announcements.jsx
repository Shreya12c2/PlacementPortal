import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(()=> {
    // demo static data (or call GET /api/notifications)
    axios.get(`${API}/api/notifications`).then(r=>setItems(r.data || []));
  },[]);

  const addAnnouncement = async () => {
    // for demo just prepend locally. Hook into a POST endpoint when available.
    if(!title) return alert("Add title");
    const newAnn = { id: Date.now(), title, body };
    setItems(prev=>[newAnn, ...prev]);
    setTitle(""); setBody("");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Announcements</h1>

      <div className="mb-4 p-4 bg-white rounded shadow">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 border px-3 py-2 rounded" />
        <textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Message" className="w-full mb-2 border px-3 py-2 rounded" />
        <div className="text-right">
          <button onClick={addAnnouncement} className="px-4 py-2 bg-indigo-600 text-white rounded">Post Announcement</button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(it=>(
          <div key={it.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-slate-600">{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
