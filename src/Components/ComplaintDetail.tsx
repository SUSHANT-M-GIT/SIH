// src/components/ComplaintDetail.tsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
import { apiService } from '../services/api';
import { Complaint, FileData } from '../types'; // Ensure FileData is imported
import {
  ArrowLeft,
  FileText,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Folder,
  Film,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
} from 'lucide-react';

function ComplaintDetail() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [files, setFiles] = useState<FileData[]>([]); // State now holds FileData objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const context = useContext(UserContext);
  if (!context) {
    throw new Error('ComplaintDetail must be used within a ContextProvider');
  }
  const { useremail } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (!useremail || !complaintId) {
      navigate('/dashboard');
      return;
    }

    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getComplaintForUser(useremail, complaintId);
        // Backend now returns a single complaint object and file data array
        setComplaint(response.complaint);
        setFiles(response.files || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch complaint details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [useremail, complaintId, navigate]);

  // --- Helper functions updated for Base64 content ---

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'mov':
        return 'video/quicktime';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream'; // Generic binary file type
    }
  };

  const createDataUrl = (file: FileData): string => {
    const mimeType = getMimeType(file.fileName);
    return `data:${mimeType};base64,${file.fileContent}`;
  };

  const isImageFile = (fileName: string): boolean => {
    return getMimeType(fileName).startsWith('image/');
  };

  const isVideoFile = (fileName: string): boolean => {
    return getMimeType(fileName).startsWith('video/');
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error || 'Complaint not found.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="gov-button-primary touch-target"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gov-gradient-bg)' }}>
      <header className="gov-header tricolor-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg text-sm text-gray-700 hover:bg-white/70 touch-target transition-colors"
              >
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <Shield size={20} className="text-orange-600" />
                <span className="text-sm font-medium text-slate-700">Complaint Details</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Official Record</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 sm:py-8 mobile-container">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Complaint #{complaint.complaintId.slice(0, 8)}</h1>
                    <p className="text-blue-100 text-sm">Government of India | भारत सरकार</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock size={16} />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-sm font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Complaint Content */}
            <div className="gov-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Complaint Description</h2>
                  <p className="text-sm text-gray-600">Detailed information provided by citizen</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-orange-400">
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{complaint.complaints}</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="gov-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Folder size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Document Attachments</h2>
                    <p className="text-sm text-gray-600">{files.length} file{files.length > 1 ? 's' : ''} uploaded by citizen</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => {
                    const dataUrl = createDataUrl(file);
                    return (
                      <div key={index} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:border-orange-300 transition-all">
                        <a
                          href={dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center hover:from-orange-50 hover:to-orange-100 transition-colors group"
                        >
                          {isImageFile(file.fileName) ? (
                            <img src={dataUrl} alt={file.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : isVideoFile(file.fileName) ? (
                            <div className="flex flex-col items-center space-y-2">
                              <Film className="w-12 h-12 text-purple-500 group-hover:text-purple-600" />
                              <span className="text-xs text-purple-600 font-medium">Video</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <FileText className="w-12 h-12 text-blue-500 group-hover:text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">Document</span>
                            </div>
                          )}
                        </a>
                        <div className="p-3 bg-white border-t border-slate-100">
                          <p className="font-semibold text-gray-800 text-sm truncate mb-2" title={file.fileName}>
                            {file.fileName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {file.fileName.split('.').pop()?.toUpperCase()}
                            </span>
                            <a
                              href={dataUrl}
                              download={file.fileName}
                              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline transition-colors"
                            >
                              <Download size={14} />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="gov-card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Citizen Information</h3>
                  <p className="text-sm text-gray-600">Official government record</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <InfoItem icon={FileText} label="Complaint ID" value={complaint.complaintId} mono />
                <InfoItem icon={Calendar} label="Date Submitted" value={formatDate(complaint.complaint_date)} />
                <InfoItem icon={User} label="Citizen Name" value={complaint.name} />
                <InfoItem icon={Mail} label="Email Address" value={complaint.email} />
                {complaint.phone && <InfoItem icon={Phone} label="Contact Number" value={complaint.phone} />}
                <InfoItem icon={MapPin} label="Address" value={complaint.address} />
              </div>
            </div>

            {/* Status Card */}
            <div className="gov-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Status Information</h3>
                  <p className="text-sm text-gray-600">Current complaint status</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">Current Status</span>
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-800">Priority</span>
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">NORMAL</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-sm font-medium text-orange-800">Department</span>
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">GENERAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Enhanced InfoItem component with better styling
const InfoItem = ({ icon: Icon, label, value, mono = false }: { icon: React.ElementType, label: string, value: string, mono?: boolean }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Icon size={16} className="text-slate-600" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-sm font-semibold text-gray-800 break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
        </div>
    </div>
);

export default ComplaintDetail;