"use client";

import React from 'react';

// SignUp component that accepts appearance prop
export const SignUp = ({ appearance }: { appearance?: any }) => {
  return (
    <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>
      <h2 className="text-xl font-bold mb-4">Sign Up (Demo Mode)</h2>
      <p>Authentication is bypassed for this demo.</p>
      <button 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </button>
    </div>
  );
};

// SignIn component that accepts appearance prop
export const SignIn = ({ appearance }: { appearance?: any }) => {
  return (
    <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>
      <h2 className="text-xl font-bold mb-4">Sign In (Demo Mode)</h2>
      <p>Authentication is bypassed for this demo.</p>
      <button 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </button>
    </div>
  );
};