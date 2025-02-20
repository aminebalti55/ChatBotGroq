import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Signup failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}