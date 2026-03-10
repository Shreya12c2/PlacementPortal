import React from "react";

export default function ReportsDashboard() {
  // Placeholder dashboard — later connect to /api/summary, /api/company-wise etc.
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Placement Summary</h3>
          <p className="text-slate-600">Total students, placed count, placement rate — connect to backend stats.</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Company-wise Offers</h3>
          <p className="text-slate-600">Bar chart placeholder — use Recharts to display company-wise data from API.</p>
        </div>
      </div>
    </div>
  );
}
