"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OuraSleepChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/oura/history?days=30`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        if (Array.isArray(json)) {
          const formattedData = json.map((item: any) => ({
            date: item.day,
            hours: item.total_sleep_duration ? Number((item.total_sleep_duration / 3600).toFixed(2)) : 0
          }));
          setData(formattedData);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-6 p-4 bg-gray-900 rounded-lg animate-pulse h-64 flex items-center justify-center text-gray-400">Loading sleep chart...</div>;
  if (error) return <div className="mt-6 p-4 bg-red-900 rounded-lg text-red-200">Error loading chart: {error}</div>;
  if (!data.length) return null;

  return (
    <div className="mt-6 pt-6 border-t border-gray-700">
      <h3 className="text-lg font-bold text-gray-300 mb-4">Last 30 Days - Sleep (hrs)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem', color: '#F3F4F6' }}
              itemStyle={{ color: '#A78BFA' }}
              labelStyle={{ color: '#9CA3AF', marginBottom: '0.25rem' }}
            />
            <Line type="monotone" dataKey="hours" stroke="#A78BFA" strokeWidth={3} dot={{ r: 3, fill: '#A78BFA' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
