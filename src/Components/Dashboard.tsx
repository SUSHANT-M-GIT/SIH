import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
import { apiService } from '../services/api';
import { Complaint } from '../types';
import { PlusCircle, FileText, User, LogOut, Search, Shield, Flag, Calendar, Clock, ArrowRight, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import GovEmblem from './GovEmblem';

function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const context = useContext(UserContext);
  if (!context) throw new Error('Dashboard must be used within ContextProvider');
  const { username, useremail, setUserName, setUserEmail } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (!useremail) {
      navigate('/login');
      return;
    }
    
    fetchComplaints();
  }, [useremail, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllComplaintsForUser(useremail);
      setComplaints(Array.isArray(response.complaint) ? response.complaint : []);
    } catch (err: any) {
      setError('Failed to fetch complaints');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserName('');
    setUserEmail('');
    navigate('/login');
  };

  const handleCreateComplaint = () => {
    navigate('/create-complaint');
  };

  const handleViewComplaint = (complaintId: string) => {
    navigate(`/complaint/${complaintId}`);
  };

  const formatComplaintId = (id: string) => {
    return id.slice(0, 8) + '...';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-400/20 rounded-full blur-3xl float-animation"></div>
      </div>
      {/* Stunning Header */}
      <header className="relative z-10 gov-header">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <GovEmblem size={56} className="glow-animation" />
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-full blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  <span className="hidden sm:inline">Government Portal</span>
                  <span className="sm:hidden">Gov Portal</span>
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  <span className="hidden sm:inline">भारत सरकार | Government of India</span>
                  <span className="sm:hidden">भारत सरकार</span>
                </p>
              </div>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{username || useremail?.split('@')[0]}</p>
                  <p className="text-white/60 text-xs">Citizen</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-red-400/30"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Hero Welcome Section */}
        <div className="premium-card mb-12 p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full mb-6 float-animation">
              <Shield size={32} className="text-white drop-shadow-lg" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mb-4">
              Welcome back, {username || useremail?.split('@')[0]}!
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              🇮🇳 Your digital gateway to citizen services. File complaints, track progress, and make your voice heard.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                <Flag size={16} className="text-green-600" />
                <span className="font-semibold text-green-700">Secure & Verified</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
                <CheckCircle size={16} className="text-orange-600" />
                <span className="font-semibold text-orange-700">24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <Clock size={16} className="text-purple-600" />
                <span className="font-semibold text-purple-700">Fast Resolution</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200">
            <p className="text-gray-700 font-medium">
              "भारत सरकार - Your voice drives our action. Together, we build a better India."
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCreateComplaint}
            className="gov-button-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto touch-target"
          >
            <PlusCircle size={20} />
            <span>Create New Complaint</span>
          </button>
        </div>

        {/* Complaints Section */}
        <div className="gov-card mobile-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-white" />
              </div>
              <span>Your Complaints</span>
            </h3>
            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
              <Search size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{complaints.length} complaints</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchComplaints}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors touch-target"
              >
                Try Again
              </button>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Complaints Filed Yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                You haven't filed any complaints yet. Start by creating your first complaint to get assistance from government services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleCreateComplaint}
                  className="gov-button-primary inline-flex items-center space-x-2 touch-target"
                >
                  <PlusCircle size={20} />
                  <span>File Your First Complaint</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Shield size={16} className="text-orange-500" />
                  <span>Secure & Confidential</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  🇮🇳 Your complaints are handled by official government departments with full privacy protection.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {complaints.map((complaint) => (
                <div
                  key={complaint.complaintId}
                  className="group bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                  onClick={() => handleViewComplaint(complaint.complaintId)}
                >
                  {/* Top gradient bar */}
                  <div className="h-2 bg-gradient-to-r from-orange-400 via-red-400 to-green-500"></div>
                  
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            #{formatComplaintId(complaint.complaintId)}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                          GOVT
                        </span>
                      </div>
                    </div>

                    {/* Complaint Preview */}
                    <div className="mb-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-slate-700 text-sm line-clamp-3 leading-relaxed">
                          {complaint.complaints}
                        </p>
                      </div>
                    </div>

                    {/* Citizen Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-xs">
                        <User size={14} className="text-slate-500" />
                        <span className="text-slate-600 font-medium">{complaint.name}</span>
                      </div>
                      {complaint.phone && (
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-500">📞</span>
                          <span className="text-slate-600">{complaint.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="text-slate-600">
                          {new Date(complaint.complaint_date || Date.now()).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">Pending Review</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                        <Eye size={14} />
                        <span className="text-xs font-semibold">View Details</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;