"use client";

import { useEffect, useState } from 'react';

const VERSION = '1.1';
const defaultData = {
  version: VERSION,
  workout: {
    exercises: [
      { id: 1, name: 'Monday', details: 'Weight Training (Upper Body Push)', done: false },
      { id: 2, name: 'Tuesday', details: 'VO2 Max + Zone 2 (Run/Bike)', done: false },
      { id: 3, name: 'Wednesday', details: 'Weight Training (Lower Body)', done: false },
      { id: 4, name: 'Thursday', details: 'Fat Burn Cardio (Zone 2)', done: false },
      { id: 5, name: 'Friday', details: 'Weight Training (Upper Body Pull)', done: false },
      { id: 6, name: 'Saturday', details: 'VO2 Max + Zone 2 (Run/Bike)', done: false },
      { id: 7, name: 'Sunday', details: 'Rest or Active Recovery', done: false }
    ],
    supplements: [
      { id: 1, name: 'Morning: Omeprazole, Probiotic', taken: false },
      { id: 2, name: 'Breakfast: Omega-3, Propecia, Creatine', taken: false },
      { id: 3, name: 'Lunch/Dinner: Vitamin D3, Permixon, Sulforaphane', taken: false },
      { id: 4, name: 'Bed: Magnesium Glycinate', taken: false }
    ],
    healthCheck: '2026-10-01',
    watchOuts: ['High cholesterol risk', 'Keep an eye on left knee']
  }
};

export default function WorkoutSchedule() {
  const [data, setData] = useState<any>(null);
  const [editingEx, setEditingEx] = useState<number | null>(null);
  const [editDetails, setEditDetails] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gusup_workout_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === VERSION) {
        setData(parsed);
      } else {
        setData(defaultData);
        localStorage.setItem('gusup_workout_data', JSON.stringify(defaultData));
      }
    } else {
      setData(defaultData);
      localStorage.setItem('gusup_workout_data', JSON.stringify(defaultData));
    }
  }, []);

  const updateData = (newData: any) => {
    setData(newData);
    localStorage.setItem('gusup_workout_data', JSON.stringify(newData));
  };

  const toggleExercise = (id: number) => {
    const newData = { ...data };
    const ex = newData.workout.exercises.find((e: any) => e.id === id);
    if (ex) {
      ex.done = !ex.done;
      updateData(newData);
    }
  };

  const toggleSupplement = (id: number) => {
    const newData = { ...data };
    const sup = newData.workout.supplements.find((s: any) => s.id === id);
    if (sup) {
      sup.taken = !sup.taken;
      updateData(newData);
    }
  };

  const saveEdit = (id: number) => {
    const newData = { ...data };
    const ex = newData.workout.exercises.find((e: any) => e.id === id);
    if (ex) {
      ex.details = editDetails;
      updateData(newData);
      setEditingEx(null);
    }
  };

  const setHealthCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    newData.workout.healthCheck = e.target.value;
    updateData(newData);
  };

  const viewGraph = (metric: string) => {
    alert(`Viewing historical graph for: ${metric}\n(Graph UI mocked for MVP)`);
  };

  if (!data) return <div className="p-4 bg-gray-800 rounded animate-pulse">Loading daily data...</div>;

  return (
    <div className="space-y-6">
      {/* Daily Workout View */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Daily Workout</h2>
        <ul className="space-y-3">
          {data.workout.exercises.map((ex: any) => (
            <li key={ex.id} className="p-3 bg-gray-700 rounded-md">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExercise(ex.id)}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={ex.done} readOnly className="w-5 h-5" />
                  <span className={`font-semibold ${ex.done ? 'line-through text-gray-500' : 'text-white'}`}>{ex.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); viewGraph(ex.name); }} className="text-sm text-green-400 hover:underline">Stats</button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingEx(ex.id); setEditDetails(ex.details); }} className="text-sm text-yellow-400 hover:underline">Edit</button>
                </div>
              </div>
              {editingEx === ex.id ? (
                <div className="mt-2 flex gap-2">
                  <input value={editDetails} onChange={e => setEditDetails(e.target.value)} className="bg-gray-900 text-white px-2 py-1 rounded w-full" onClick={e => e.stopPropagation()} />
                  <button onClick={(e) => { e.stopPropagation(); saveEdit(ex.id); }} className="bg-blue-600 px-3 py-1 rounded">Save</button>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1 pl-8 cursor-pointer" onClick={() => alert(ex.details)}>{ex.details}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Daily Supplements View */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-green-400">Daily Supplements</h2>
        <ul className="space-y-2">
          {data.workout.supplements.map((sup: any) => (
            <li key={sup.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded-md cursor-pointer" onClick={() => toggleSupplement(sup.id)}>
              <input type="checkbox" checked={sup.taken} readOnly className="w-5 h-5" />
              <span className={`${sup.taken ? 'line-through text-gray-500' : 'text-white'}`}>{sup.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Health Watch-outs & Next Health Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-900">
          <h2 className="text-xl font-bold mb-4 text-red-400">Health Watch-outs</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            {data.workout.watchOuts.map((w: string, i: number) => <li key={i}>{w}</li>)}
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-900">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Next Health Check</h2>
          <input type="date" value={data.workout.healthCheck} onChange={setHealthCheck} className="bg-gray-900 text-white px-4 py-2 rounded-md w-full" />
        </div>
      </div>
    </div>
  );
}
