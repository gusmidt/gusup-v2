import { NextResponse } from 'next/server';
import { getData, saveData } from '@/lib/db';

export async function GET() {
  return NextResponse.json(getData());
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = getData();
  
  if (body.type === 'TOGGLE_EXERCISE') {
    const ex = data.workout.exercises.find((e: any) => e.id === body.id);
    if (ex) ex.done = !ex.done;
  } else if (body.type === 'EDIT_EXERCISE') {
    const ex = data.workout.exercises.find((e: any) => e.id === body.id);
    if (ex) ex.details = body.details;
  } else if (body.type === 'TOGGLE_SUPPLEMENT') {
    const sup = data.workout.supplements.find((s: any) => s.id === body.id);
    if (sup) sup.taken = !sup.taken;
  } else if (body.type === 'SET_HEALTH_CHECK') {
    data.workout.healthCheck = body.date;
  }

  saveData(data);
  return NextResponse.json(data);
}
