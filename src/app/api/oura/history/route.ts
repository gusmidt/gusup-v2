import { NextResponse } from 'next/server';

const OURA_API_BASE = 'https://api.ouraring.com/v2/usercollection';

export async function GET(req: Request) {
  const token = process.env.OURA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Oura access token not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30', 10);

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const url = new URL(`${OURA_API_BASE}/sleep`);
  url.searchParams.append('start_date', startDate);
  url.searchParams.append('end_date', endDate);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Oura API error on sleep: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return NextResponse.json(json.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
