import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
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
      // For now, we'll simulate login since the backend doesn't have login endpoint
      // In real implementation, you'd call an authentication API
      if (email && password) {
        // Store user info in context
        setUserEmail(email);
        setUserName(email.split('@')[0]); // Use email prefix as name for now
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mobile-container" style={{ background: 'var(--gov-gradient-bg)' }}>
      <div className="gov-card tricolor-border w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <GovEmblem size={64} className="mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold gov-gradient-text mb-2">Government Portal</h1>
          <p className="text-sm text-slate-600">भारत सरकार | Government of India</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Secure Citizen Login</p>
          </div>
        </div>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm text-center">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input 
              className="w-full p-4 mt-1 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 touch-target transition-colors"
              type="email" 
              placeholder="citizen.email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input 
              className="w-full p-4 mt-1 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 touch-target transition-colors"
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="gov-button-primary w-full touch-target disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Don't have an account? <Link to="/createuser" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">Register as Citizen</Link>
          </p>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Powered by Digital India Initiative 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;