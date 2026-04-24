"use client";

export default function WorkoutSchedule() {
  const schedule = [
    { day: 'Mon', workout: 'Chest & Triceps', supplements: ['Creatine', 'Whey', 'Fish Oil'] },
    { day: 'Tue', workout: 'Back & Biceps', supplements: ['Creatine', 'Whey', 'Vitamin D'] },
    { day: 'Wed', workout: 'Active Recovery', supplements: ['Creatine', 'Magnesium'] },
    { day: 'Thu', workout: 'Legs & Core', supplements: ['Creatine', 'Whey', 'Pre-workout'] },
    { day: 'Fri', workout: 'Shoulders & Arms', supplements: ['Creatine', 'Whey', 'Fish Oil'] },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Workout & Supplements</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Day</th>
              <th className="px-4 py-3">Workout</th>
              <th className="px-4 py-3 rounded-tr-lg">Supplements</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, i) => (
              <tr key={i} className="border-b border-gray-700 last:border-0">
                <td className="px-4 py-3 font-medium text-white">{item.day}</td>
                <td className="px-4 py-3">{item.workout}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.supplements.map((sup, j) => (
                      <span key={j} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                        {sup}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
