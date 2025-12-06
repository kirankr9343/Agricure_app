// In src/app/api/auth/verify-otp/route.ts

import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin'; // We only need auth
import dbConnect from '@/lib/dbConnect';       // Our new DB connection
import User from '@/models/User';              // Our new User model

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // 1. Connect to YOUR MongoDB
    await dbConnect();

    // 2. Find the user in YOUR database
    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    // 3. Check if user is ALREADY verified
    if (user.isVerified) {
      // User is already good. We don't need to log them in,
      // just tell the form to go to the next step.
      return NextResponse.json(
        { msg: 'User is already verified.' }, 
        { status: 200 }
      );
    }

    // 4. If not verified, check the OTP
    if (user.otp !== otp) {
      return NextResponse.json({ msg: 'Invalid OTP' }, { status: 400 });
    }
    
    // Check if user.otpExpires is null or expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json({ msg: 'OTP has expired' }, { status: 400 });
    }

    // 5. Success! Update the user in YOUR database
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save(); // Save to MongoDB

    // 6. Send success message
    // We don't send a token here anymore because the form
    // just needs to go to the onboarding flow.
    return NextResponse.json(
      { msg: 'Email verified successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { msg: 'Server error during verification' },
      { status: 500 }
    );
  }
}