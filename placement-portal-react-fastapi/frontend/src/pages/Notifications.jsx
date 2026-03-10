
import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:8000'

export default function Notifications() {
  const [items, setItems] = useState([])
  useEffect(()=>{
    axios.get(`${API}/api/notifications`).then(r=>setItems(r.data))
  },[])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-3">
        {items.map(n => (
          <div key={n.id} className="card">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-slate-600">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
