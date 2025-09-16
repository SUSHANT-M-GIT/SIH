import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
import { apiService } from '../services/api';
import { Complaint } from '../types';
import { PlusCircle, FileText, User, LogOut, Search, Shield, Flag, Calendar, Clock, ArrowRight, Eye, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen" style={{ background: 'var(--gov-gradient-bg)' }}>
      {/* Header */}
      <header className="gov-header tricolor-border">
        <div className="max-w-7xl mx-auto mobile-container">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center min-w-0 flex-1 space-x-3">
              <GovEmblem size={48} className="flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold gov-gradient-text truncate">
                  <span className="hidden sm:inline">Government Complaint Portal</span>
                  <span className="sm:hidden">Gov Portal</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  <span className="hidden sm:inline">भारत सरकार | Government of India</span>
                  <span className="sm:hidden">भारत सरकार</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate max-w-32">{username || useremail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 sm:px-4 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-target bg-white/50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mobile-container py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="gov-card mobile-card mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Welcome, {username || useremail?.split('@')[0]}!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base flex items-center space-x-2">
                <Flag size={16} className="text-orange-500" />
                <span>Citizen Services Portal - भारत सरकार</span>
              </p>
            </div>
          </div>
          <p className="text-slate-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            ἞E἟3 File and track your complaints through our secure government portal. Your voice matters for a better India.
          </p>
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