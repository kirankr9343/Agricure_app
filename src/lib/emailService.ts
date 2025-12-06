
import nodemailer from 'nodemailer';

// It reads the variables from your .env.local file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

export const sendOTPEmail = async (toEmail: string, otp: string) => {
  const mailOptions = {
    from: `"AgriCure" <${process.env.AUTH_EMAIL}>`,
    to: toEmail,
    subject: 'Your AgriCure OTP Code',
    html: `
      <h2>Welcome to AgriCure!</h2>
      <p>Your One-Time Password (OTP) to verify your account is:</p>
      <h1 style="font-size: 40px; color: #333;">${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', toEmail);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};