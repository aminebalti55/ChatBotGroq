'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/app/utils/Toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create account');
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast.success('Account created successfully!');
        router.push('/');
      } else {
        throw new Error('No access token received');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      showToast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                  border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 
                  dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                  border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 
                  dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                  border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 
                  dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}