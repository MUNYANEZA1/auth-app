// User model shema for MongoDB
import mongoose, { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface that extends the Document interface
export interface User extends Document{
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  profilePicture: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const UserSchema = new Schema({
  // First name field - required string
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  // Last name field - required string
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  // Age field - required number with validation
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [13, "Must be at least 13 years old"],
  },
  // Email field - required, unique string with validation
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  // Username field - required string
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  // Profile picture field - string with default value
  profilePictureUrl: {
    type: String,
    default: '/default-avatar.png',
  },
  // Password field - required with minimum length
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
},
  // Add timestamps for createdAt and updatedAt
  { timestamps: true }
);

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();

  try {
    
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();

  } catch (error: any) {
    next(error);
    
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    
    // Compare the candidate password with the stored hashed password
    return await bcrypt.compare(candidatePassword, this.password);

  } catch (error) {
    return false;
  }
};

// Create and export the User model
// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.User ||
  mongoose.model<User>("User", UserSchema);