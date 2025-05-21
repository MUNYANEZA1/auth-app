// TypeScript type definitions for the application

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  username: string;
  profilePictureUrl: string;
  password?: string; // Optional when returning user data to client
  createdAt?: Date;
  updatedAt?: Date;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Form input types
export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  profilePictureUrl?: File;
}

// New interface for form validation errors
export interface FormValidationErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  profilePictureUrl?: string;
}

export interface UpdateProfileInputs {
  firstName?: string;
  lastName?: string;
  age?: number;
  username?: string;
}

export interface UpdateProfileValidationErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  username?: string;
}