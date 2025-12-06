// src/app/api/auth/send-email-otp/route.ts

import { NextResponse } from 'next/server';
// import { adminAuth } from '@/lib/firebaseAdmin'; // <-- COMMENT THIS OUT
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/emailService';
import otpGenerator from 'otp-generator';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ msg: 'Email is required' }, { status: 400 });
    }

    // 1. Connect to MongoDB
    await dbConnect();

    // 2. SKIPPING FIREBASE ADMIN FOR NOW
    // (We will assume the user is valid to test the email function)
    const fakeUid = "temp_uid_" + Date.now(); 

    // 3. Find or Create the user in YOUR MongoDB
    let userInOurDb = await User.findOne({ email });
    
    if (!userInOurDb) {
      userInOurDb = new User({
        uid: fakeUid, // Using a temporary UID since Firebase Admin is disabled
        email: email,
      });
    }

    // 4. Generate and save OTP to YOUR database
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    
    userInOurDb.otp = otp;
    userInOurDb.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await userInOurDb.save(); // Save to MongoDB

    // 5. Send the OTP email
    console.log(`Attempting to send OTP to ${email}...`);
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { msg: 'Failed to send OTP email. Check VS Code terminal for details.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { msg: 'OTP has been sent to your email.' },
      { status: 200 }
    );
  
  } catch (error: any) {
    // THIS LOGS THE REAL ERROR TO YOUR VS CODE TERMINAL
    console.error('Server Error Details:', error); 
    
    return NextResponse.json(
      { msg: 'Server error. Check VS Code Terminal for the real error.' },
      { status: 500 }
    );
  }
}