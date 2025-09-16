import axios from 'axios';
import { User, Complaint, CreateUserResponse, ComplaintResponse } from '../types';

// Dynamic API URL that works for both local and mobile access
const BASE_URL = process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost' 
  ? 'http://localhost:8080'
  : `http://${window.location.hostname}:8080`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Login user
  login: async (email: string, password: string): Promise<any> => {
    const response = await api.get('/login', {
      params: { email, password }
    });
    return response.data;
  },

  // Create a new user
  createUser: async (userData: User): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/createuser', userData);
    return response.data;
  },

  // Create a new complaint with files
  createComplaint: async (
    email: string,
    complaints: string,
    files: File[]
  ): Promise<string> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('complaints', complaints);
    
    // Only append files if there are any
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }
    // Don't send files parameter at all if no files are selected

    const response = await api.post<string>('/createCompalaint', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all complaints for a user
  getAllComplaintsForUser: async (email: string): Promise<ComplaintResponse> => {
    const response = await api.get<ComplaintResponse>('/getallcomplaintforuser', {
      params: { email },
    });
    return response.data;
  },

  // Get specific complaint for a user
  getComplaintForUser: async (
    email: string,
    complaintId: string
  ): Promise<ComplaintResponse> => {
    const response = await api.get<ComplaintResponse>('/getcomplaintforuser', {
      params: { email, complaintId },
    });
    return response.data;
  },
};

export default api;