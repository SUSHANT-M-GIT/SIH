import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, X, FileText, AlertCircle, MapPin, Image as ImageIcon, Video, Paperclip, Shield, Flag, CheckCircle, Info, Clock, Sparkles, Star } from 'lucide-react';
import GovEmblem from './GovEmblem';
import { cn } from '../utils/cn';

function CreateComplaint() {
  const [complaint, setComplaint] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const context = useContext(UserContext);
  if (!context) throw new Error('CreateComplaint must be used within a ContextProvider');
  const { useremail } = context;
  
  const navigate = useNavigate();

  // Helper to format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('Failed to fetch address.');
          
          const data = await response.json();
          const address = data.display_name || 'Address could not be determined.';
          setLocation({ latitude, longitude, address });
        } catch (geoError) {
          setLocation({ latitude, longitude, address: `Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}` });
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        let message = 'Could not get location. ' + (err.code === 1 ? 'Please allow location access.' : 'An unknown error occurred.');
        setError(message);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!useremail) {
      navigate('/login');
      return;
    }
    if (!complaint.trim()) {
      setError('Please enter your complaint description.');
      return;
    }

    setError('');
    setLoading(true);

    let finalComplaint = complaint;
    if (location) {
      finalComplaint += `\n\n--- Location Information ---\nAddress: ${location.address}\nCoordinates: (${location.latitude}, ${location.longitude})`;
    }

    try {
      await apiService.createComplaint(useremail, finalComplaint, files);
      navigate('/dashboard', { state: { message: 'Complaint created successfully!' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const FileIcon = ({ file }: { file: File }) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="text-purple-500" />;
    if (file.type.startsWith('video/')) return <Video className="text-orange-500" />;
    if (file.type === 'application/pdf') return <FileText className="text-red-500" />;
    return <Paperclip className="text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl text-sm text-gray-700 hover:bg-white shadow-lg border border-white/20 transition-all"
            >
              <ArrowLeft size={16} /> 
              <span>Back</span>
            </motion.button>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-200">
              <Shield size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Secure Portal</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <GovEmblem size={80} className="mx-auto" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-orange-300 rounded-full"
              />
            </div>
            
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent"
              >
                File New Complaint
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto"
              >
                भारत सरकार | Government of India - Secure Complaint Portal
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center space-x-6 mt-6"
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                <Sparkles size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Routing</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">24/7 Processing</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                <Star size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Verified Platform</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Form Container */}
      <motion.main 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-4 pb-12"
      >
        {/* Centered Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 p-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-t-3xl px-8 py-6">
              <div className="flex items-center justify-center space-x-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-green-700">Step 1: Details</span>
                </motion.div>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-orange-400 rounded-full"></div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Upload size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-orange-700">Step 2: Attachments</span>
                </motion.div>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full"></div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-blue-700">Step 3: Submit</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 mb-4">
                <FileText size={20} className="text-blue-600" />
                <span className="font-semibold text-blue-800">Complaint Information</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Concern</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your voice matters. Help us serve you better by providing detailed information about your complaint.
              </p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Complaint Description */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full border border-green-200/50">
                    <FileText size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Step 1: Describe Your Issue</span>
                  </div>
                </div>
                
                <div className="relative group">
                  <label htmlFor="complaint-desc" className="block text-lg font-bold text-gray-800 mb-2 text-center">
                    What's your complaint about? *
                  </label>
                  <p className="text-center text-gray-600 mb-6">Provide detailed information to help us understand and resolve your concern</p>
                  
                  <div className="relative">
                    <textarea
                      id="complaint-desc"
                      className={cn(
                        "w-full p-6 bg-white/80 backdrop-blur-sm border-2 rounded-2xl",
                        "focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-300",
                        "resize-none shadow-lg hover:shadow-xl",
                        complaint.length > 0 ? "border-green-300" : "border-slate-200"
                      )}
                      rows={8}
                      placeholder="Describe your complaint in detail. Include:
• What happened?
• When did it occur?
• Where did it happen?
• Who was involved?
• What resolution are you seeking?

The more details you provide, the better we can assist you..."
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      required
                    />
                    
                    {/* Character counter with progress bar */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          complaint.length > 100 ? "bg-green-500" : complaint.length > 50 ? "bg-yellow-500" : "bg-gray-300"
                        )}></div>
                        <span className="text-xs font-medium text-gray-600">
                          {complaint.length} chars
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: complaint.length > 50 ? 1 : 0, scale: complaint.length > 50 ? 1 : 0.8 }}
                    className="flex items-center justify-center mt-4"
                  >
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">Good detail level!</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Location and File Upload in Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Location Section */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full border border-green-200/50 mb-4">
                    <MapPin size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Location (Optional)</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading || !!location}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
                  >
                    {locationLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <MapPin size={20} />
                    )}
                    <span className="font-medium">
                      {locationLoading ? 'Getting Location...' : 'Add Current Location'}
                    </span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {location && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-green-50 border-2 border-green-200 rounded-2xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle size={20} className="text-green-600" />
                            <div className="text-left">
                              <p className="text-sm font-semibold text-green-800">Location Added</p>
                              <p className="text-xs text-green-600 truncate max-w-48">{location.address}</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setLocation(null)} 
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* File Upload Section */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 mb-4">
                    <Upload size={16} className="text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Attachments (Optional)</span>
                  </div>
                  
                  <label htmlFor="file-upload" className="block cursor-pointer group">
                    <div className="border-2 border-dashed border-purple-200 rounded-2xl px-6 py-8 hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="font-semibold text-gray-700 mb-2">
                        <span className="text-purple-600">Upload Files</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Images, Videos, Documents (Max 10MB)
                      </p>
                    </div>
                    <input id="file-upload" name="files" type="file" multiple onChange={handleFileChange} className="sr-only" />
                  </label>

                  
                  {files.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-2"
                    >
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2">
                            <FileIcon file={file} />
                            <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeFile(index)} 
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center space-x-3 text-center justify-center">
                      <AlertCircle size={24} className="text-red-500" />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Submit Section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center pt-8"
              >
                <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-3xl p-8 border-2 border-gradient-to-r from-orange-200 to-green-200">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-800">Ready to Submit Your Complaint?</h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your complaint will be securely processed by government officials within 24-48 hours.
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading || !complaint.trim()}
                      className={cn(
                        "inline-flex items-center justify-center space-x-3 px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl",
                        loading || !complaint.trim() 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-gradient-to-r from-orange-500 via-red-500 to-green-500 text-white hover:shadow-2xl"
                      )}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          <span>Submitting Your Complaint...</span>
                        </>
                      ) : (
                        <>
                          <Shield size={24} />
                          <span>Submit Complaint Securely</span>
                          <Sparkles size={20} />
                        </>
                      )}
                    </motion.button>
                    
                    <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield size={14} className="text-blue-500" />
                        <span>Government Verified</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} className="text-orange-500" />
                        <span>24/7 Processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default CreateComplaint;