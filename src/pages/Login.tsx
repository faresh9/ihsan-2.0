import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">ihsan 2.0</h1>
          <h2 className="mt-2 text-muted-foreground">Sign in to your account</h2>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
