import { NextResponse } from 'next/server';

const OURA_API_BASE = 'https://api.ouraring.com/v2/usercollection';

async function fetchOuraData(endpoint: string, token: string, queryDate: string | null) {
  const url = new URL(`${OURA_API_BASE}/${endpoint}`);
  
  let startDate = queryDate;
  let endDate = queryDate;

  if (!queryDate) {
    endDate = new Date().toISOString().split('T')[0];
    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  } else {
    // We want data for that specific date. We should fetch start_date = date, end_date = date + 1 day
    // to ensure we capture the target date
    const d = new Date(queryDate);
    const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    endDate = nextDay.toISOString().split('T')[0];
  }
  
  url.searchParams.append('start_date', startDate as string);
  url.searchParams.append('end_date', endDate as string);

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    // Don't cache when querying specific date dynamically
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Oura API error on ${endpoint}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function GET(req: Request) {
  const token = process.env.OURA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Oura access token not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const queryDate = searchParams.get('date');

  try {
    const [sleep, readiness, activity] = await Promise.all([
      fetchOuraData('sleep', token, queryDate),
      fetchOuraData('daily_readiness', token, queryDate),
      fetchOuraData('daily_activity', token, queryDate)
    ]);

    return NextResponse.json({
      sleep: sleep.data[sleep.data.length - 1] || null,
      readiness: readiness.data[readiness.data.length - 1] || null,
      activity: activity.data[activity.data.length - 1] || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
