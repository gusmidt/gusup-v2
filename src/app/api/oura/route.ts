import { NextResponse } from 'next/server';

const OURA_API_BASE = 'https://api.ouraring.com/v2/usercollection';

async function fetchOuraData(endpoint: string, token: string) {
  const url = new URL(`${OURA_API_BASE}/${endpoint}`);
  // Fetch data for the last 7 days
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  url.searchParams.append('start_date', startDate);
  url.searchParams.append('end_date', endDate);

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    next: { revalidate: 3600 } // Cache for an hour
  });

  if (!res.ok) {
    throw new Error(`Oura API error on ${endpoint}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function GET() {
  const token = process.env.OURA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Oura access token not configured' }, { status: 500 });
  }

  try {
    const [sleep, readiness, activity] = await Promise.all([
      fetchOuraData('sleep', token),
      fetchOuraData('daily_readiness', token),
      fetchOuraData('daily_activity', token)
    ]);

    // Just grab the most recent data point
    return NextResponse.json({
      sleep: sleep.data[sleep.data.length - 1] || null,
      readiness: readiness.data[readiness.data.length - 1] || null,
      activity: activity.data[activity.data.length - 1] || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
