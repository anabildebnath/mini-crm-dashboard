import { useState, useEffect } from 'react';
import { getCustomers } from '../api/customers';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, byTag: {} });

  useEffect(() => {
    // fetch overall customers count and tag breakdown
    getCustomers({ stats: true }).then(res => setStats(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Customers</h2>
          <p className="text-4xl mt-2 font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow col-span-1">
          <h2 className="text-xl font-semibold">Customers by Tag</h2>
          <ul className="mt-2 space-y-1">
            {Object.entries(stats.byTag).map(([tag, count]) => (
              <li key={tag} className="flex justify-between">
                <span>{tag}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}