"use client";

import { useState } from 'react';

export default function MealMacros() {
  const [macros, setMacros] = useState({ protein: 120, carbs: 150, fat: 50 });

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-green-400">Meal Macros</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Protein</span>
            <span className="text-white font-bold">{macros.protein}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Carbs</span>
            <span className="text-white font-bold">{macros.carbs}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Fat</span>
            <span className="text-white font-bold">{macros.fat}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
      <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition">
        Log Meal
      </button>
    </div>
  );
}
