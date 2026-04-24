"use client";

import { useEffect, useState } from 'react';

const VERSION = '1.4'; // incremented to force update with new schema
const defaultData = {
  version: VERSION,
  workout: {
    exercises: [
      { id: 1, name: 'Monday', title: 'Weight Training (Upper Body Push)', goal: 'Muscle Growth', duration: '45-60 min', description: 'Bench press, overhead press, triceps dips, push-ups. 3 sets of 8-10 reps each.', done: false },
      { id: 2, name: 'Tuesday', title: 'VO2 Max + Zone 2', goal: 'Cardio Fitness', duration: '45 min', description: 'Warm-up 10 min. 4 x 4-minute high-intensity intervals on bike or treadmil with 3-minute recovery. 30-40 min zone 2.', done: false },
      { id: 3, name: 'Wednesday', title: 'Weight Training (Lower Body)', goal: 'Muscle Growth', duration: '45-60 min', description: 'Squats, deadlifts, lunges, calf raises. 3 sets of 8-10 reps each.', done: false },
      { id: 4, name: 'Thursday', title: 'Fat Burn Cardio (Zone 2)', goal: 'Endurance & Recovery', duration: '45-60 min', description: '45-minute steady state cycling or brisk walking keeping heart rate in Zone 2.', done: false },
      { id: 5, name: 'Friday', title: 'Weight Training (Upper Body Pull)', goal: 'Muscle Growth', duration: '45-60 min', description: 'Pull-ups or lat pull-downs, barbell rows, bicep curls. 3 sets of 8-10 reps each.', done: false },
      { id: 6, name: 'Saturday', title: 'VO2 Max + Zone 2', goal: 'Cardio Fitness', duration: '45 min', description: 'Warm-up 10 min. 4 x 4-minute high-intensity intervals on bike or treadmil with 3-minute recovery. 30-40 min zone 2.', done: false },
      { id: 7, name: 'Sunday', title: 'Rest or Active Recovery', goal: 'Recovery', duration: 'Flexible', description: '30-minute walk, yoga session, or full body stretching to aid recovery.', done: false }
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

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
  </svg>
);

export default function WorkoutSchedule() {
  const [data, setData] = useState<any>(null);
  const [showFullWeek, setShowFullWeek] = useState(false);
  const [todayName, setTodayName] = useState('');

  useEffect(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setTodayName(dayNames[new Date().getDay()]);

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

  const setHealthCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    newData.workout.healthCheck = e.target.value;
    updateData(newData);
  };

  if (!data) return <div className="p-4 bg-gray-800 rounded animate-pulse text-white">Loading daily data...</div>;

  const todayWorkout = data.workout.exercises.find((ex: any) => ex.name === todayName);

  return (
    <div className="space-y-6">
      {/* Today's Workout View */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Today's Workout: {todayName}</h2>
        
        {todayWorkout ? (
          <div className="space-y-4">
            <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-2">{todayWorkout.title}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-xs font-semibold">Goal</span>
                  <span className="text-white">{todayWorkout.goal}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-xs font-semibold">Duration</span>
                  <span className="text-white">{todayWorkout.duration}</span>
                </div>
              </div>
              <div className="mb-4 bg-gray-900/50 p-4 rounded-lg border border-gray-600/50">
                <span className="text-gray-400 block uppercase tracking-wider text-xs font-semibold mb-2">Description / Exercises</span>
                <p className="text-white text-lg font-medium whitespace-pre-wrap leading-relaxed">{todayWorkout.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button 
                  onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(todayWorkout.description)}`, '_blank')}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <PlayIcon /> See tutorials
                </button>
                <button 
                  onClick={() => toggleExercise(todayWorkout.id)}
                  className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors text-white ${todayWorkout.done ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  {todayWorkout.done ? '✓ Completed' : 'Mark Workout Complete'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No workout scheduled for today.</p>
        )}

        <div className="mt-6">
          <button 
            onClick={() => setShowFullWeek(!showFullWeek)}
            className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {showFullWeek ? 'Hide This Week\'s Schedule' : 'View This Week\'s Schedule'}
          </button>
          
          {showFullWeek && (
            <div className="mt-4 space-y-3">
              {data.workout.exercises.map((ex: any) => (
                <div key={ex.id} className={`p-4 rounded-lg border ${ex.name === todayName ? 'bg-gray-700 border-blue-500' : 'bg-gray-800 border-gray-600'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{ex.name}: {ex.title}</h4>
                      <p className="text-sm text-gray-400">{ex.duration} • {ex.goal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ex.done && <span className="text-green-400 text-sm font-bold">✓ Done</span>}
                      {ex.name !== todayName && (
                        <input type="checkbox" checked={ex.done} onChange={() => toggleExercise(ex.id)} className="w-5 h-5 rounded cursor-pointer" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
