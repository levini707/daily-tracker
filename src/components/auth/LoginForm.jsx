import React, { useState } from 'react';
import { Calendar, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onLogin, onSignup, authError, setAuthError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await onSignup(email, password);
    } else {
      await onLogin(email, password);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Calendar className="w-12 h-12 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Daily Tracker</h1>
        </div>
        <p className="text-gray-600 text-center mb-6">
          {isSignUp ? 'Create your account' : 'Welcome back!'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 outline-none"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="flex-1 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center justify-center"
          >
            <User className="w-5 h-5 mr-2" />
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError('');
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;