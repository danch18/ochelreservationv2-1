import type { Reservation } from '@/types';

// Email service configuration
const EMAIL_CONFIG = {
  from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'shasan1807013@gmail.com',
  replyTo: process.env.NEXT_PUBLIC_EMAIL_REPLY_TO || 'shasan1807013@gmail.com',
  apiUrl: '/api/send-email' // We'll create this API endpoint
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  // Send reservation confirmation email
  async sendReservationConfirmation(reservation: Reservation): Promise<void> {
    const emailData: EmailData = {
      to: reservation.email,
      subject: `Reservation Confirmation - ${reservation.name}`,
      html: generateConfirmationEmailHTML(reservation),
      text: generateConfirmationEmailText(reservation)
    };

    try {
      const response = await fetch(EMAIL_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Email service error (${response.status}):`, errorText);
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        console.error('Email service failed:', result);
        throw new Error(result.error || 'Failed to send email');
      }
      
      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email confirmation sent successfully:', result.message);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      
      // Provide more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to send confirmation email: ${errorMessage}`);
    }
  },

  // Send admin confirmation email (when admin confirms a pending reservation)
  async sendAdminConfirmationEmail(reservation: Reservation): Promise<void> {
    const emailData: EmailData = {
      to: reservation.email,
      subject: `Réservation Confirmée - ochel Restaurant`,
      html: generateAdminConfirmationEmailHTML(reservation),
      text: generateAdminConfirmationEmailText(reservation)
    };

    try {
      const response = await fetch(EMAIL_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Email service error (${response.status}):`, errorText);
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        console.error('Email service failed:', result);
        throw new Error(result.error || 'Failed to send email');
      }
      
      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Admin confirmation email sent successfully:', result.message);
      }
    } catch (error) {
      console.error('Error sending admin confirmation email:', error);
      
      // Provide more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to send confirmation email: ${errorMessage}`);
    }
  },

  // Send reservation cancellation email
  async sendReservationCancellation(reservation: Reservation): Promise<void> {
    const emailData: EmailData = {
      to: reservation.email,
      subject: `Reservation Cancelled - ${reservation.name}`,
      html: generateCancellationEmailHTML(reservation),
      text: generateCancellationEmailText(reservation)
    };

    try {
      const response = await fetch(EMAIL_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Email service error (${response.status}):`, errorText);
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        console.error('Email service failed:', result);
        throw new Error(result.error || 'Failed to send email');
      }
      
      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Cancellation email sent successfully:', result.message);
      }
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      // Don't throw here as cancellation should still work even if email fails
    }
  }
};

// Generate HTML email template for confirmation
function generateConfirmationEmailHTML(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Confirmation</title>
      <style>
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #eeeeee;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .email-container {
          background: #191919;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header {
          background: #191919;
          color: #eeeeee;
          padding: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
          font-size: 2.5em;
          font-weight: bold;
          color: #eeeeee;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tagline {
          color: #b4b4b4;
          font-size: 0.9em;
        }
        .content {
          padding: 32px 24px;
          background: #191919;
          color: #eeeeee;
        }
        .greeting {
          font-size: 1.1em;
          margin-bottom: 20px;
          color: #eeeeee;
        }
        .reservation-details {
          background: rgba(100, 74, 64, 0.1);
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          border: 1px solid rgba(100, 74, 64, 0.3);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #644a40;
        }
        .detail-value {
          color: #eeeeee;
          text-align: right;
        }
        .special-requests {
          background: rgba(255, 223, 181, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          border: 1px solid rgba(255, 223, 181, 0.3);
        }
        .special-requests h4 {
          margin-top: 0;
          color: #ffdfb5;
          font-size: 1.1em;
        }
        .important-notes {
          background: rgba(238, 238, 238, 0.05);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .important-notes h4 {
          color: #eeeeee;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .important-notes ul {
          margin: 0;
          padding-left: 20px;
        }
        .important-notes li {
          margin-bottom: 8px;
          color: #b4b4b4;
        }
        .contact-info {
          background: rgba(100, 74, 64, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          border: 1px solid rgba(100, 74, 64, 0.3);
        }
        .contact-info h4 {
          color: #644a40;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .contact-info p {
          color: #eeeeee;
          margin: 8px 0;
          line-height: 1.5;
        }
        .footer {
          background: rgba(0, 0, 0, 0.3);
          padding: 24px;
          text-align: center;
          color: #b4b4b4;
          font-size: 0.9em;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer p {
          margin: 8px 0;
        }
        .highlight {
          color: #644a40;
          font-weight: 600;
        }
        .reservation-button {
          display: inline-block;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          color: #000000;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 24px 0;
          border: 2px solid #d0d0d0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          text-align: center;
          min-width: 200px;
        }
        .reservation-button:hover {
          background: linear-gradient(135deg, #e8e8e8 0%, #d5d5d5 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .button-container {
          text-align: center;
          margin: 32px 0 24px 0;
          padding: 24px 0;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 20px 16px;
          }
          .header {
            padding: 20px 16px;
          }
          .logo {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🍽️ ochel</div>
          <div class="tagline">Fine Dining Experience</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${reservation.name},
          </div>
          
          <p>Thank you for choosing <span class="highlight">ochel</span>! We're delighted to confirm your reservation.</p>
          
          <div class="reservation-details">
            <h3 style="margin-top: 0; color: #644a40; margin-bottom: 20px;">Reservation Details</h3>
            <div class="detail-row">
              <span class="detail-label">Confirmation ID:</span>
              <span class="detail-value">#${reservation.id?.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${reservation.reservation_time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Party Size:</span>
              <span class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span class="detail-value">${reservation.phone}</span>
            </div>
          </div>
          
          ${reservation.special_requests ? `
          <div class="special-requests">
            <h4>Special Requests</h4>
            <p style="margin-bottom: 0; color: #eeeeee;">${reservation.special_requests}</p>
          </div>
          ` : ''}
          
          <div class="important-notes">
            <h4>Important Notes</h4>
            <ul>
              <li>Please arrive on time. We hold tables for 15 minutes past your reservation time.</li>
              <li>If you need to modify or cancel your reservation, please contact us at least 2 hours in advance.</li>
              <li>For parties of 6 or more, a service charge may apply.</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h4>Questions? Contact Us</h4>
            <p>(555) 123-4567</p>
            <p>info@ochel.com</p>
            <p>123 Fine Dining Street, Downtown</p>
          </div>
          
          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="reservation-button">
              Make Another Reservation
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>We look forward to serving you at <span class="highlight">ochel</span>!</p>
          <p style="font-size: 0.8em; opacity: 0.7;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email for confirmation
function generateConfirmationEmailText(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    RESERVATION CONFIRMATION - OCHEL

    Dear ${reservation.name},

    Thank you for choosing ochel! We're delighted to confirm your reservation.

    RESERVATION DETAILS:
    Confirmation ID: #${reservation.id?.slice(-8).toUpperCase()}
    Date: ${formattedDate}
    Time: ${reservation.reservation_time}
    Party Size: ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}
    Contact: ${reservation.phone}

    ${reservation.special_requests ? `SPECIAL REQUESTS:\n${reservation.special_requests}\n\n` : ''}

    IMPORTANT NOTES:
    - Please arrive on time. We hold tables for 15 minutes past your reservation time.
    - If you need to modify or cancel your reservation, please contact us at least 2 hours in advance.
    - For parties of 6 or more, a service charge may apply.

    QUESTIONS? CONTACT US:
    Phone: (555) 123-4567
    Email: info@ochel.com
    Address: 123 Fine Dining Street, Downtown

    We look forward to serving you at ochel!

    ---
    This is an automated confirmation email.
  `;
}

// Generate HTML email template for cancellation
function generateCancellationEmailHTML(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Cancelled</title>
      <style>
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #eeeeee;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .email-container {
          background: #191919;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header {
          background: #191919;
          color: #eeeeee;
          padding: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
          font-size: 2.5em;
          font-weight: bold;
          color: #eeeeee;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .content {
          padding: 32px 24px;
          background: #191919;
          color: #eeeeee;
        }
        .cancelled-details {
          background: rgba(229, 77, 46, 0.1);
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          border: 1px solid rgba(229, 77, 46, 0.3);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #e54d2e;
        }
        .detail-value {
          color: #eeeeee;
          text-align: right;
        }
        .contact-info {
          background: rgba(100, 74, 64, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          border: 1px solid rgba(100, 74, 64, 0.3);
        }
        .contact-info h4 {
          color: #644a40;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .contact-info p {
          color: #eeeeee;
          margin: 8px 0;
          line-height: 1.5;
        }
        .footer {
          background: rgba(0, 0, 0, 0.3);
          padding: 24px;
          text-align: center;
          color: #b4b4b4;
          font-size: 0.9em;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .highlight {
          color: #644a40;
          font-weight: 600;
        }
        .cancellation-icon {
          font-size: 3em;
          color: #e54d2e;
          margin-bottom: 16px;
        }
        .reservation-button {
          display: inline-block;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          color: #000000;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 24px 0;
          border: 2px solid #d0d0d0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          text-align: center;
          min-width: 200px;
        }
        .reservation-button:hover {
          background: linear-gradient(135deg, #e8e8e8 0%, #d5d5d5 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .button-container {
          text-align: center;
          margin: 32px 0 24px 0;
          padding: 24px 0;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 20px 16px;
          }
          .header {
            padding: 20px 16px;
          }
          .logo {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🍽️ ochel</div>
        </div>
        
        <div class="content">
          <div style="text-align: center;">
            <div class="cancellation-icon">❌</div>
          </div>
          
          <p>Dear ${reservation.name},</p>
          
          <p>This email confirms that your reservation has been <strong style="color: #e54d2e;">cancelled</strong>.</p>
          
          <div class="cancelled-details">
            <h3 style="margin-top: 0; color: #e54d2e; margin-bottom: 20px;">Cancelled Reservation</h3>
            <div class="detail-row">
              <span class="detail-label">Confirmation ID:</span>
              <span class="detail-value">#${reservation.id?.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${reservation.reservation_time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Party Size:</span>
              <span class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>
          
          <p>We're sorry to see you won't be joining us. If you'd like to make a new reservation, please visit our website or contact us directly.</p>
          
          <div class="contact-info">
            <h4>Ready to Book Again?</h4>
            <p>(555) 123-4567</p>
            <p>info@ochel.com</p>
            <p>123 Fine Dining Street, Downtown</p>
          </div>
          
          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="reservation-button">
              Make Another Reservation
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>We hope to see you at <span class="highlight">ochel</span> soon!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email for cancellation
function generateCancellationEmailText(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    RESERVATION CANCELLED - OCHEL

    Dear ${reservation.name},

    This email confirms that your reservation has been cancelled.

    CANCELLED RESERVATION:
    Confirmation ID: #${reservation.id?.slice(-8).toUpperCase()}
    Date: ${formattedDate}
    Time: ${reservation.reservation_time}
    Party Size: ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}

    We're sorry to see you won't be joining us. If you'd like to make a new reservation, please visit our website or contact us directly.

    Contact us: (555) 123-4567 | info@ochel.com
  `;
}

// Generate HTML email template for admin confirmation (French)
function generateAdminConfirmationEmailHTML(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réservation Confirmée</title>
      <style>
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #eeeeee;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .email-container {
          background: #191919;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header {
          background: #191919;
          color: #eeeeee;
          padding: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
          font-size: 2.5em;
          font-weight: bold;
          color: #eeeeee;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tagline {
          color: #b4b4b4;
          font-size: 0.9em;
        }
        .content {
          padding: 32px 24px;
          background: #191919;
          color: #eeeeee;
        }
        .greeting {
          font-size: 1.1em;
          margin-bottom: 20px;
          color: #eeeeee;
        }
        .confirmation-banner {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          color: white;
        }
        .confirmation-banner h2 {
          margin: 0;
          font-size: 1.5em;
          font-weight: bold;
        }
        .confirmation-banner p {
          margin: 8px 0 0 0;
          opacity: 0.9;
        }
        .reservation-details {
          background: rgba(100, 74, 64, 0.1);
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          border: 1px solid rgba(100, 74, 64, 0.3);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #644a40;
        }
        .detail-value {
          color: #eeeeee;
          text-align: right;
        }
        .special-requests {
          background: rgba(255, 223, 181, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          border: 1px solid rgba(255, 223, 181, 0.3);
        }
        .special-requests h4 {
          margin-top: 0;
          color: #ffdfb5;
          font-size: 1.1em;
        }
        .important-notes {
          background: rgba(238, 238, 238, 0.05);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .important-notes h4 {
          color: #eeeeee;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .important-notes ul {
          margin: 0;
          padding-left: 20px;
        }
        .important-notes li {
          margin-bottom: 8px;
          color: #b4b4b4;
        }
        .contact-info {
          background: rgba(100, 74, 64, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          border: 1px solid rgba(100, 74, 64, 0.3);
        }
        .contact-info h4 {
          color: #644a40;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .contact-info p {
          color: #eeeeee;
          margin: 8px 0;
          line-height: 1.5;
        }
        .footer {
          background: rgba(0, 0, 0, 0.3);
          padding: 24px;
          text-align: center;
          color: #b4b4b4;
          font-size: 0.9em;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer p {
          margin: 8px 0;
        }
        .highlight {
          color: #644a40;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 20px 16px;
          }
          .header {
            padding: 20px 16px;
          }
          .logo {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🍽️ ochel</div>
          <div class="tagline">Expérience Gastronomique Fine</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Cher(e) ${reservation.name},
          </div>
          
          <div class="confirmation-banner">
            <h2>✅ Réservation Confirmée !</h2>
            <p>Votre table est maintenant officiellement réservée</p>
          </div>
          
          <p>Excellente nouvelle ! Notre équipe a confirmé votre réservation chez <span class="highlight">ochel</span>. Nous avons hâte de vous accueillir pour une expérience culinaire exceptionnelle.</p>
          
          <div class="reservation-details">
            <h3 style="margin-top: 0; color: #644a40; margin-bottom: 20px;">Détails de votre réservation</h3>
            <div class="detail-row">
              <span class="detail-label">Numéro de confirmation :</span>
              <span class="detail-value">#${reservation.id?.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Heure :</span>
              <span class="detail-value">${reservation.reservation_time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre de convives :</span>
              <span class="detail-value">${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact :</span>
              <span class="detail-value">${reservation.phone}</span>
            </div>
          </div>
          
          ${reservation.special_requests ? `
          <div class="special-requests">
            <h4>Demandes spéciales</h4>
            <p style="margin-bottom: 0; color: #eeeeee;">${reservation.special_requests}</p>
          </div>
          ` : ''}
          
          <div class="important-notes">
            <h4>Informations importantes</h4>
            <ul>
              <li>Merci d'arriver à l'heure. Nous gardons les tables 15 minutes après l'heure de réservation.</li>
              <li>Pour modifier ou annuler votre réservation, contactez-nous au moins 2 heures à l'avance.</li>
              <li>Pour les groupes de 6 personnes ou plus, des frais de service peuvent s'appliquer.</li>
              <li>Présentation soignée appréciée pour notre établissement.</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h4>Questions ? Contactez-nous</h4>
            <p>📞 (555) 123-4567</p>
            <p>✉️ info@ochel.com</p>
            <p>📍 123 Fine Dining Street, Downtown</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Nous avons hâte de vous servir chez <span class="highlight">ochel</span> !</p>
          <p style="font-size: 0.8em; opacity: 0.7;">
            Ceci est un email de confirmation automatique. Merci de ne pas répondre à cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email for admin confirmation (French)
function generateAdminConfirmationEmailText(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    RÉSERVATION CONFIRMÉE - OCHEL

    Cher(e) ${reservation.name},

    Excellente nouvelle ! Notre équipe a confirmé votre réservation chez ochel.

    DÉTAILS DE VOTRE RÉSERVATION :
    Numéro de confirmation : #${reservation.id?.slice(-8).toUpperCase()}
    Date : ${formattedDate}
    Heure : ${reservation.reservation_time}
    Nombre de convives : ${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}
    Contact : ${reservation.phone}

    ${reservation.special_requests ? `DEMANDES SPÉCIALES :\n${reservation.special_requests}\n\n` : ''}

    INFORMATIONS IMPORTANTES :
    - Merci d'arriver à l'heure. Nous gardons les tables 15 minutes après l'heure de réservation.
    - Pour modifier ou annuler votre réservation, contactez-nous au moins 2 heures à l'avance.
    - Pour les groupes de 6 personnes ou plus, des frais de service peuvent s'appliquer.

    QUESTIONS ? CONTACTEZ-NOUS :
    Téléphone : (555) 123-4567
    Email : info@ochel.com
    Adresse : 123 Fine Dining Street, Downtown

    Nous avons hâte de vous servir chez ochel !

    ---
    Ceci est un email de confirmation automatique.
  `;
}