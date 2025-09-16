// TypeScript interfaces matching the Spring Boot backend models
export interface FileData {
  fileName: string;
  fileContent: string; // Base64 encoded content
}
export interface User {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export interface Complaint {
  complaintId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department_emails: string[] | null;
  complaints: string;
  folderPath: string;
  complaint_date: Date;

}

export interface Department {
  department_name: string;
  department_email: string;
  password: string;
  address: string;
  phone: string;
}

// API Response types
export interface CreateUserResponse {
  message: string;
  username: string;
  email: string;
}

export interface ComplaintResponse {
  user: User;
  complaint: Complaint | Complaint[];
  file?: string;
  files?: string[]; // Array of file names
}

export interface ApiError {
  message: string;
}