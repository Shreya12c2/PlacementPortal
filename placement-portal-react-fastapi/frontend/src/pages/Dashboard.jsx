import { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer, Legend } from 'recharts'
import Topbar from '../components/Topbar'

const API = import.meta.env.VITE_API || 'http://localhost:8000'

// Colors: Placed, In Process, Not Applied
const PIE_COLORS = ['#22c55e', '#facc15', '#ef4444'] // green, yellow, red
const BAR_COLOR = '#6366f1' // indigo

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_students: 0, active_drives: 0, placement_rate: 0 })
  const [status, setStatus] = useState({ placed: 0, in_process: 0, not_applied: 0 })
  const [company, setCompany] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/summary`).then(r => setSummary(r.data))
    axios.get(`${API}/api/placement-status`).then(r => setStatus(r.data))
    axios.get(`${API}/api/company-wise`).then(r => setCompany(r.data))
  }, [])

  const pieData = [
    { name: 'Placed', value: status.placed },
    { name: 'In Process', value: status.in_process },
    { name: 'Not Applied', value: status.not_applied },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Topbar />
      <div className="flex gap-4">
        <div className="tile flex-1">
          <div>
            <div className="text-slate-500 text-sm">Total Students</div>
            <div className="text-3xl font-bold mt-1">{summary.total_students}</div>
          </div>
          <div className="text-3xl">👤</div>
        </div>
        <div className="tile flex-1">
          <div>
            <div className="text-slate-500 text-sm">Active Drives</div>
            <div className="text-3xl font-bold mt-1">{summary.active_drives}</div>
          </div>
          <div className="text-3xl">🧳</div>
        </div>
        <div className="tile flex-1">
          <div>
            <div className="text-slate-500 text-sm">Placement Rate</div>
            <div className="text-3xl font-bold mt-1">{summary.placement_rate}%</div>
          </div>
          <div className="text-3xl">📈</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Placement Status</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                  <Cell key="placed" fill={PIE_COLORS[0]} />
                  <Cell key="inprocess" fill={PIE_COLORS[1]} />
                  <Cell key="notapplied" fill={PIE_COLORS[2]} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Company-wise Placements</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Offers" fill={BAR_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
