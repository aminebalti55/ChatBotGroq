import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const formData = new URLSearchParams();
    formData.append('username', body.email);
    formData.append('password', body.password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || 'Login failed' }, { status: response.status });
    }

    const nextResponse = NextResponse.json(data);
    nextResponse.cookies.set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}