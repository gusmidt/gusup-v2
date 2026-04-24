"use client";

import { useEffect, useState } from 'react';

export default function OuraWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/oura')
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 bg-gray-800 rounded-lg animate-pulse h-32">Loading Oura data...</div>;
  if (error) return <div className="p-4 bg-red-900 rounded-lg text-red-200">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-purple-400">Oura Ring Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-sm text-gray-400 uppercase">Sleep Score</h3>
          <p className="text-3xl font-bold text-white">{data.sleep?.score || 'N/A'}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-sm text-gray-400 uppercase">Readiness</h3>
          <p className="text-3xl font-bold text-white">{data.readiness?.score || 'N/A'}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-sm text-gray-400 uppercase">Activity</h3>
          <p className="text-3xl font-bold text-white">{data.activity?.score || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
