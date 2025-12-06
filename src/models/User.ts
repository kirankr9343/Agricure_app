// In src/models/User.ts

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // This is the unique ID from Firebase Authentication
  uid: { 
    type: String, 
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add all your other user data here
  // location: { type: String },
  // farms: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' } ]
});

// This line prevents errors in Next.js from re-compiling the model
export default mongoose.models.User || mongoose.model('User', UserSchema);