"use client";

import React from 'react';

// Inline component definition instead of importing from auth-provider
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-white p-8 rounded-lg bg-[rgba(20,20,30,0.85)] backdrop-blur-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Sign Up (Demo Mode)</h2>
        <p>Authentication is bypassed for this demo.</p>
        <button 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}