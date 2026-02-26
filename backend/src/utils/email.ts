import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error: any) {
    logger.error('Email sending failed:', error.message);
    throw new Error('Email could not be sent');
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Serene Wellbeing!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining Serene Wellbeing Hub! We're excited to have you on board.</p>
            <p>Your account has been successfully created. You can now browse our expert directory, book sessions, and access wellbeing resources.</p>
            <a href="${process.env.FRONTEND_URL}/browse" class="button">Browse Experts</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Serene Wellbeing Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Serene Wellbeing',
    html,
  });
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" class="button">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Serene Wellbeing',
    html,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You requested to reset your password. Click the button below to set a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - Serene Wellbeing',
    html,
  });
};

export const sendBookingConfirmation = async (
  email: string,
  name: string,
  sessionDetails: any
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your session has been successfully booked!</p>
            <div class="details">
              <p><strong>Expert:</strong> ${sessionDetails.expertName}</p>
              <p><strong>Date:</strong> ${sessionDetails.date}</p>
              <p><strong>Time:</strong> ${sessionDetails.time}</p>
              <p><strong>Duration:</strong> ${sessionDetails.duration} minutes</p>
              <p><strong>Price:</strong> $${sessionDetails.price}</p>
            </div>
            <p>A reminder will be sent 24 hours before your session.</p>
            <p>Best regards,<br>The Serene Wellbeing Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Session Booking Confirmed - Serene Wellbeing',
    html,
  });
};

export const sendSessionReminder = async (
  email: string,
  name: string,
  sessionDetails: any
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4F46E5; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Session Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>This is a reminder that you have an upcoming session in 24 hours!</p>
            <div class="details">
              <p><strong>Expert:</strong> ${sessionDetails.expertName}</p>
              <p><strong>Date:</strong> ${sessionDetails.date}</p>
              <p><strong>Time:</strong> ${sessionDetails.time}</p>
              <p><strong>Duration:</strong> ${sessionDetails.duration} minutes</p>
            </div>
            ${sessionDetails.meetingLink ? `<a href="${sessionDetails.meetingLink}" class="button">Join Session</a>` : ''}
            <p>We look forward to seeing you!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Session Reminder - Tomorrow - Serene Wellbeing',
    html,
  });
};
export const sendLowCreditReminder = async (
  email: string,
  companyName: string,
  remainingCredits: number
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Low Credit Alert!</h1>
          </div>
          <div class="content">
            <h2>Hello ${companyName} Admin,</h2>
            <p>Your company's wellness credits are running low.</p>
            <p><strong>Remaining Credits:</strong> ${remainingCredits.toFixed(2)}</p>
            <p>To ensure uninterrupted access to sessions for your employees, please recharge your credits soon.</p>
            <a href="${process.env.FRONTEND_URL}/dashboard/company/billing" class="button">Recharge Credits</a>
            <p>Best regards,<br>The Serene Wellbeing Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Action Required: Low Credits for ${companyName} - Serene Wellbeing`,
    html,
  });
};

export const sendEmployeeInvitation = async (
  email: string,
  name: string,
  companyName: string,
  temporaryPassword: string,
  isAdmin: boolean = false
): Promise<void> => {
  const roleText = isAdmin ? 'company admin' : 'employee';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credentials { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4F46E5; }
          .button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .warning { background: #FEF3C7; padding: 10px; border-left: 4px solid #F59E0B; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Serene Wellbeing!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You have been invited to join <strong>${companyName}</strong>'s wellness program on Serene Wellbeing as ${roleText}.</p>
            <p>Your account has been created with the following credentials:</p>
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            </div>
            <div class="warning">
              <p><strong>Important:</strong> Please change your password immediately after your first login for security purposes.</p>
            </div>
            <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
            <p>As ${roleText}, you will have access to:</p>
            <ul>
              <li>Browse and book sessions with certified wellness experts</li>
              <li>Access wellness resources and content library</li>
              <li>Track your wellness journey and progress</li>
              ${isAdmin ? '<li>Manage employee access and company wellness dashboard</li>' : ''}
              ${isAdmin ? '<li>View company usage analytics and reports</li>' : ''}
            </ul>
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
            <p>Best regards,<br>The Serene Wellbeing Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Invitation to join ${companyName}'s Wellness Program - Serene Wellbeing`,
    html,
  });
};
