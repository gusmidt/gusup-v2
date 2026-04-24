"use client";

import { useEffect, useState } from 'react';

export default function OuraWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/oura?date=${selectedDate}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const viewGraph = (metric: string) => {
    alert(`Viewing historical graph for: ${metric}\n(Graph UI mocked for MVP)`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-400">Oura Ring Stats</h2>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
        />
      </div>

      {loading ? (
        <div className="p-4 bg-gray-900 rounded-lg animate-pulse h-32 flex items-center justify-center text-gray-400">Loading Oura data...</div>
      ) : error ? (
        <div className="p-4 bg-red-900 rounded-lg text-red-200">Error: {error}</div>
      ) : !data ? (
        <div className="p-4 bg-gray-900 rounded-lg text-gray-400">No data found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Sleep Score')}>
            <h3 className="text-xs text-gray-400 uppercase">Sleep Score</h3>
            <p className="text-2xl font-bold text-white">{data.sleep?.score || 'N/A'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Total Sleep (Hrs)')}>
            <h3 className="text-xs text-gray-400 uppercase">Total Sleep (hrs)</h3>
            <p className="text-2xl font-bold text-white">{data.sleep?.total_sleep_duration ? (data.sleep.total_sleep_duration / 3600).toFixed(1) : 'N/A'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Readiness')}>
            <h3 className="text-xs text-gray-400 uppercase">Readiness</h3>
            <p className="text-2xl font-bold text-white">{data.readiness?.score || 'N/A'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Activity')}>
            <h3 className="text-xs text-gray-400 uppercase">Activity</h3>
            <p className="text-2xl font-bold text-white">{data.activity?.score || 'N/A'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => viewGraph('Steps')}>
            <h3 className="text-xs text-gray-400 uppercase">Steps</h3>
            <p className="text-2xl font-bold text-white">{data.activity?.steps?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
