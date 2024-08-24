"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/dashboard'); // Redirect to a protected page
    } else {
      setError(data.error || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="absolute ml-2 text-gray-400" />
              <input
                type="email"
                id="email"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="absolute ml-2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-2 top-2 text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
