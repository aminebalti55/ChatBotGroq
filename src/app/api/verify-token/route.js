import { NextResponse } from 'next/server';

export async function GET(req) {
  try {

    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token with backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // If token is valid, return user data
    const userData = await response.json();
    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      is_active: userData.is_active,
      created_at: userData.created_at
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}