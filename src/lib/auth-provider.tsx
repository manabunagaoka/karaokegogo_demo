import React from 'react';

/**
 * Empty SignUp component that satisfies the import requirements
 */
export const SignUp: React.FC<{ appearance?: any }> = ({ appearance }) => {
  return null;
};

/**
 * Empty SignIn component that satisfies the import requirements 
 */
export const SignIn: React.FC<{ appearance?: any }> = ({ appearance }) => {
  return null;
};

/**
 * Auth provider component
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default AuthProvider;