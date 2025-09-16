import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { User } from '../types';
import GovEmblem from './GovEmblem';

function CreateUser() {
  const [formData, setFormData] = useState<Omit<User, 'email'> & { email: string }>({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await apiService.createUser(formData);
      
      if (response.message === "User created successfully") {
        navigate('/login', { 
          state: { message: "Account created successfully! Please log in." } 
        });
      } else {
        setError(response.message || 'An unknown error occurred.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center mobile-container" style={{ background: 'var(--gov-gradient-bg)' }}>
      <div className="gov-card tricolor-border w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <GovEmblem size={56} className="mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold gov-gradient-text mb-2">
            Citizen Registration
          </h1>
          <p className="text-sm text-slate-600">भारत सरकार | Government of India</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Name</label>
            <input 
              className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target" 
              type="text" 
              name="name"
              placeholder="Your full name"
              value={formData.name} 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input 
              className="w-full p-4 mt-1 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 touch-target transition-colors"
              type="email" 
              name="email"
              placeholder="your.email@example.com"
              value={formData.email} 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input 
              className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target" 
              type="password" 
              name="password"
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Address</label>
            <input 
              className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target" 
              type="text" 
              name="address"
              placeholder="Your address"
              value={formData.address} 
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Phone</label>
            <input 
              className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target" 
              type="tel" 
              name="phone"
              placeholder="Your phone number"
              value={formData.phone} 
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="gov-button-primary w-full touch-target disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default CreateUser;