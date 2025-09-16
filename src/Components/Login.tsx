import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
import { apiService } from '../services/api';
import GovEmblem from './GovEmblem';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(UserContext);
  if (!context) throw new Error('Login must be used within ContextProvider');
  const { setUserName, setUserEmail } = context;

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      // Call backend login API
      const response = await apiService.login(email, password);
      
      // If we get here, it means status is 200 (OK)
      // Store user info in context
      setUserEmail(email);
      setUserName(email.split('@')[0]); // Use email prefix as name for now
      
      // Navigate to dashboard only on successful login
      navigate('/dashboard');
      
    } catch (err: any) {
      // Handle different HTTP status codes from backend
      if (err.response?.status === 404) {
        setError('User not found. Please check your email.');
      } else if (err.response?.status === 400) {
        setError('Invalid password. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4 relative">
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/4 right-16 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      
      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 relative">
          {/* Tricolor Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-3xl"></div>
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <GovEmblem size={72} className="mx-auto mb-4 drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Government Portal
              </span>
            </h1>
            <p className="text-sm text-gray-600 mb-4">भारत सरकार | Government of India</p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-blue-800 font-medium">Secure Citizen Portal</span>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                <p className="text-sm text-green-700 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <input 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Portal
                </div>
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">New to the portal?</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <Link 
              to="/createuser" 
              className="inline-flex items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register as New Citizen
            </Link>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="mr-2">🇮🇳</span>
                <span>Powered by Digital India Initiative</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Secure • Reliable • Accessible
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;