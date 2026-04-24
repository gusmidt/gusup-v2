"use client";

import { useState, useEffect } from 'react';

const defaultMacros = { protein: 0, carbs: 0, fat: 0 };
const goals = { protein: 180, carbs: 200, fat: 70 }; // arbitrary goals for the bar

export default function MealMacros() {
  const [macros, setMacros] = useState(defaultMacros);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [isGuessing, setIsGuessing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gusup_meal_macros');
    if (saved) {
      setMacros(JSON.parse(saved));
    } else {
      localStorage.setItem('gusup_meal_macros', JSON.stringify(defaultMacros));
    }
  }, []);

  const updateMacros = (newMacros: any) => {
    setMacros(newMacros);
    localStorage.setItem('gusup_meal_macros', JSON.stringify(newMacros));
  };

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;
    setIsGuessing(true);

    try {
      const res = await fetch('/api/guess-macros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal: mealInput })
      });

      if (!res.ok) throw new Error('Failed to guess macros');

      const estimated = await res.json();

      const newMacros = {
        protein: macros.protein + (estimated.protein || 0),
        carbs: macros.carbs + (estimated.carbs || 0),
        fat: macros.fat + (estimated.fat || 0)
      };

      updateMacros(newMacros);
      setIsModalOpen(false);
      setMealInput('');
    } catch (error) {
      console.error(error);
      alert('Failed to estimate macros. Please try again.');
    } finally {
      setIsGuessing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 relative">
      <h2 className="text-xl font-bold mb-4 text-green-400">Meal Macros</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Protein ({goals.protein}g)</span>
            <span className="text-white font-bold">{macros.protein}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (macros.protein / goals.protein) * 100)}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Carbs ({goals.carbs}g)</span>
            <span className="text-white font-bold">{macros.carbs}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (macros.carbs / goals.carbs) * 100)}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Fat ({goals.fat}g)</span>
            <span className="text-white font-bold">{macros.fat}g</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (macros.fat / goals.fat) * 100)}%` }}></div>
          </div>
        </div>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition">
        Log Meal
      </button>

      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 flex items-center justify-center p-4 rounded-lg z-10">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 w-full">
            <h3 className="text-lg font-bold text-white mb-4">Log Meal Macros</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-400 text-sm mb-1">What did you eat?</label>
                <textarea
                  value={mealInput}
                  onChange={e => setMealInput(e.target.value)}
                  placeholder="e.g., 2 eggs and a slice of toast"
                  className="w-full bg-gray-700 text-white rounded p-2 min-h-[100px]"
                  disabled={isGuessing}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleLogMeal} disabled={isGuessing} className="bg-green-500 text-white px-4 py-2 rounded flex-1 disabled:opacity-50">
                {isGuessing ? 'Estimating...' : 'Save'}
              </button>
              <button onClick={() => { setIsModalOpen(false); setMealInput(''); }} disabled={isGuessing} className="bg-gray-600 text-white px-4 py-2 rounded flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
