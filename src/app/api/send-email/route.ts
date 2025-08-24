import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import type { EmailData } from '@/services/emailService';
import { ENV_CONFIG } from '@/lib/constants';

// Email configuration - you can switch to different providers
const createTransporter = (): nodemailer.Transporter => {
  // Option 1: Gmail (requires app password)
  if (process.env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use app password, not regular password
      }
    });
  }

  // Option 2: SMTP (works with most providers)
  if (process.env.EMAIL_PROVIDER === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Option 3: Resend (modern email service)
  if (process.env.EMAIL_PROVIDER === 'resend') {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  }

  // Fallback: log emails to console in development
  if (ENV_CONFIG.isDevelopment) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }

  throw new Error('Email provider not configured');
};

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json();

    // Validate email data
    if (!emailData.to || !emailData.subject || !emailData.html) {
      return NextResponse.json(
        { success: false, error: 'Missing required email fields' },
        { status: 400 }
      );
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'shasan1807013@gmail.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || ''
    };

    // Use Resend SDK if configured
    if (process.env.EMAIL_PROVIDER === 'resend' && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const result = await resend.emails.send({
          from: mailOptions.from,
          to: [mailOptions.to],
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text
        });

        console.log('✅ Email sent via Resend:', result);
        
        return NextResponse.json({
          success: true,
          messageId: result.data?.id || 'resend-success',
          message: 'Email sent successfully via Resend'
        });
      } catch (resendError) {
        console.error('Resend error:', resendError);
        
        return NextResponse.json({
          success: false,
          error: 'Failed to send email via Resend',
          details: ENV_CONFIG.isDevelopment ? (resendError as Error).message : undefined
        }, { status: 500 });
      }
    }

    // In development, just log the email instead of sending it
    if (ENV_CONFIG.isDevelopment) {
      console.log('📧 Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('HTML Preview:', mailOptions.html.substring(0, 200) + '...');
      console.log('Full Text:', mailOptions.text || 'No plain text version');
      
      return NextResponse.json({
        success: true,
        message: 'Email logged to console (development mode)',
        messageId: `dev-${Date.now()}`
      });
    }

    // Production email sending with nodemailer (fallback)
    try {
      const transporter = createTransporter();
      const info = await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully'
      });
    } catch (transportError) {
      console.error('Email transport error:', transportError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
        details: ENV_CONFIG.isDevelopment ? (transportError as Error).message : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in email service:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process email request',
        details: ENV_CONFIG.isDevelopment ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}