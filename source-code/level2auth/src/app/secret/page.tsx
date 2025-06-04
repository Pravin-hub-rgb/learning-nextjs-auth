'use client'

import React, { useState, useEffect } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase';

export default function Secret() {
  const router = useRouter()

  // State to track whether user authentication check is still loading
  const [loading, setLoading] = useState(true);

  // useEffect runs once after component mounts to check if user is authenticated
  useEffect(() => {
    // Async function to check current user session from Supabase
    const checkUser = async () => {
      // Get current user from Supabase auth API
      const { data, error } = await supabase.auth.getUser();

      // If error or no user found, redirect to login page
      if (error || !data.user) {
        router.push('/login');
      }

      // Authentication check done, stop loading spinner
      setLoading(false);
    };

    // Call the async checkUser function
    checkUser();
  }, [router]); // Dependency on router instance (stable but required for React rules)

  // While loading, show a simple loading message
  if (loading) {
    return <div className='p-4 text-center'>Loading...</div>;
  }

  // Main secret page content shown only after successful auth check
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-950 border border-gray-800 rounded-xl shadow-lg p-10 text-center animate-fade-in">
        {/* Icon to visually emphasize protected content */}
        <div className="flex justify-center mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-emerald-400" />
        </div>
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-2">Access Granted 🔐</h1>
        {/* Description */}
        <p className="text-gray-400 mb-6">
          You&apos;ve reached the secret area of the app. This route is protected and visible only to authenticated users.
        </p>
        {/* Fun little footer text */}
        <div className="text-sm text-gray-600">
          You must be someone important. 🤫
        </div>
      </div>
    </div>
  )
}
