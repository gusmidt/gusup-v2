import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

const defaultData = {
  workout: {
    exercises: [
      { id: 1, name: 'Bench Press', details: '3 sets of 10 reps', done: false },
      { id: 2, name: 'Squats', details: '4 sets of 8 reps', done: false }
    ],
    supplements: [
      { id: 1, name: 'Creatine', taken: false },
      { id: 2, name: 'Whey Protein', taken: false },
      { id: 3, name: 'Fish Oil', taken: false }
    ],
    healthCheck: '2026-10-01',
    watchOuts: ['High cholesterol risk', 'Keep an eye on left knee']
  }
};

export function getData() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export function saveData(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
