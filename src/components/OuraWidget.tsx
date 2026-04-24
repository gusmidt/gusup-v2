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

  // Oura API returns sleep in seconds. Total hours = total_sleep_duration / 3600
  const sleepDuration = data.sleep?.total_sleep_duration || 0;
  const totalHours = sleepDuration ? (sleepDuration / 3600).toFixed(1) : 'N/A';

  const viewGraph = (metric: string) => {
    alert(`Viewing historical graph for: ${metric}\n(Graph UI mocked for MVP)`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-purple-400">Oura Ring Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Sleep Score')}>
          <h3 className="text-xs text-gray-400 uppercase">Sleep Score</h3>
          <p className="text-2xl font-bold text-white">{data.sleep?.score || 'N/A'}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Total Sleep (Hrs)')}>
          <h3 className="text-xs text-gray-400 uppercase">Total Sleep (hrs)</h3>
          <p className="text-2xl font-bold text-white">{totalHours}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Readiness')}>
          <h3 className="text-xs text-gray-400 uppercase">Readiness</h3>
          <p className="text-2xl font-bold text-white">{data.readiness?.score || 'N/A'}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Activity')}>
          <h3 className="text-xs text-gray-400 uppercase">Activity</h3>
          <p className="text-2xl font-bold text-white">{data.activity?.score || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
