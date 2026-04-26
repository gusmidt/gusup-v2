"use client";

import { useEffect, useState } from 'react';
import OuraSleepChart from './OuraSleepChart';

export default function OuraWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Generate the last 14 days
  const dateOptions = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const isToday = i === 13;
    const dateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const label = isToday ? 'Today' : `${days[d.getDay()]} ${d.getDate()}`;
    return { dateString, label };
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-purple-400 shrink-0">Oura Ring Stats</h2>
        <div className="flex overflow-x-auto space-x-2 pb-2 w-full md:w-auto scrollbar-hide">
          {dateOptions.map((opt) => (
            <button
              key={opt.dateString}
              onClick={() => setSelectedDate(opt.dateString)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDate === opt.dateString
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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

      <OuraSleepChart />
    </div>
  );
}
