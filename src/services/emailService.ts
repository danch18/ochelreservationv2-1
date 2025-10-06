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
  // Send reservation submission acknowledgment email (sent immediately upon submission)
  async sendReservationSubmission(reservation: Reservation): Promise<void> {
    const emailData: EmailData = {
      to: reservation.email,
      subject: `Reservation Request Received - ${reservation.name}`,
      html: generateSubmissionEmailHTML(reservation),
      text: generateSubmissionEmailText(reservation)
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
        console.log('✅ Submission email sent successfully:', result.message);
      }
    } catch (error) {
      console.error('Error sending submission email:', error);

      // Provide more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to send submission email: ${errorMessage}`);
    }
  },

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
          font-family: 'Forum', Georgia, serif;
          line-height: 1.6;
          color: #EFE6D2;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #000000;
          min-height: 100vh;
        }
        .email-container {
          background: #101010;
          border-radius: 0.25rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .header {
          background: #1a1a1a;
          color: #FFF2CC;
          padding: 40px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        }
        .logo {
          font-family: 'Forum', Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: #FFF2CC;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          line-height: normal;
        }
        .tagline {
          color: #FFD65A;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .content {
          padding: 40px 32px;
          background: #101010;
          color: #EFE6D2;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
        }
        .greeting {
          font-family: 'Forum', Georgia, serif;
          font-size: 16px;
          margin-bottom: 24px;
          color: #FFF2CC;
          font-weight: 400;
          line-height: 1.6;
        }
        .confirmation-message {
          background: rgba(255, 214, 90, 0.1);
          border-left: 4px solid #FFD65A;
          padding: 20px;
          margin: 24px 0;
          border-radius: 0.25rem;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          color: #EFE6D2;
          font-weight: 400;
          line-height: 1.6;
        }
        .reservation-details {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          padding: 32px;
          margin: 32px 0;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .reservation-details h3 {
          color: #FFF2CC;
          font-family: 'Forum', Georgia, serif;
          font-size: 24px;
          font-weight: 400;
          line-height: normal;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-family: 'Forum', Georgia, serif;
          font-weight: 400;
          color: #FFD65A;
          font-size: 14px;
          line-height: 1.6;
        }
        .detail-value {
          font-family: 'Forum', Georgia, serif;
          color: #EFE6D2;
          text-align: right;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.6;
        }
        .special-requests {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          padding: 24px;
          margin: 32px 0;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .special-requests h4 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #FFD65A;
          font-family: 'Forum', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          line-height: normal;
        }
        .special-requests p {
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          color: #EFE6D2;
        }
        .important-notes {
          background: rgba(255, 214, 90, 0.1);
          border-radius: 0.25rem;
          padding: 24px;
          margin: 32px 0;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .important-notes h4 {
          color: #FFD65A;
          margin-top: 0;
          margin-bottom: 16px;
          font-family: 'Forum', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          line-height: normal;
        }
        .important-notes ul {
          margin: 0;
          padding-left: 24px;
        }
        .important-notes li {
          margin-bottom: 12px;
          color: #EFE6D2;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .important-notes li::marker {
          color: #FFD65A;
        }
        .contact-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          padding: 32px;
          margin: 32px 0;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .contact-info h4 {
          color: #FFD65A;
          margin-top: 0;
          margin-bottom: 20px;
          font-family: 'Forum', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          line-height: normal;
        }
        .contact-info p {
          color: #EFE6D2;
          margin: 12px 0;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 400;
        }
        .footer {
          background: #1a1a1a;
          padding: 32px 24px;
          text-align: center;
          color: #EFE6D2;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
        }
        .footer p {
          margin: 12px 0;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .highlight {
          color: #FFD65A;
          font-weight: 400;
        }
        .reservation-button {
          display: inline-block;
          background: #FFD65A;
          color: #000000;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 0.25rem;
          font-family: 'Forum', Georgia, serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.6;
          margin: 24px 0;
          border: none;
          transition: all 0.3s ease;
          text-align: center;
          min-width: 200px;
        }
        .reservation-button:hover {
          background: #EFE6D2;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
          padding: 24px 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          margin: 32px 0;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 24px 20px;
          }
          .header {
            padding: 32px 20px;
          }
          .logo {
            font-size: 24px;
          }
          .reservation-details, .special-requests, .important-notes, .contact-info {
            padding: 24px 20px;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .detail-value {
            text-align: left;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">Magnifiko Réservez</div>
          <div class="tagline">Fine Dining Experience</div>
        </div>

        <div class="content">
          <div class="greeting">
            Dear ${reservation.name},
          </div>

          <div class="confirmation-message">
             Thank you for choosing <span class="highlight">Magnifiko Réservez</span>! We're delighted to confirm your reservation and look forward to providing you with an exceptional dining experience.
          </div>

          <div class="reservation-details">
            <h3>Reservation Details</h3>
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
            <p>${reservation.special_requests}</p>
          </div>
          ` : ''}

          <div class="divider"></div>

          <div class="important-notes">
            <h4>Important Notes</h4>
            <ul>
              <li>Please arrive on time. We hold tables for 15 minutes past your reservation time.</li>
              <li>If you need to modify or cancel your reservation, please contact us at least 2 hours in advance.</li>
              <li>For parties of 6 or more, a service charge may apply.</li>
              <li>We offer an extensive wine selection and craft cocktails to complement your meal.</li>
            </ul>
          </div>

          <div class="contact-info">
            <h4>Questions? Contact Us</h4>
            <p>01 49 59 00 94</p>
            <p>compte.magnifiko@gmail.com</p>
            <p>63 Bd Paul Vaillant Couturier, 94200 Ivry-sur-Seine, France</p>
            <p>Lundi - Dimanche, 11h00 - 00h00 (Service continu)</p>
          </div>

          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="reservation-button">
              Make Another Reservation
            </a>
          </div>
        </div>

        <div class="footer">
          <p>We look forward to serving you at <span class="highlight">Magnifiko Réservez</span>!</p>
          <p style="font-size: 0.85em; opacity: 0.8; margin-top: 16px;">
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
          font-family: 'Forum', Georgia, serif;
          line-height: 1.6;
          color: #EFE6D2;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #000000;
          min-height: 100vh;
        }
        .email-container {
          background: #101010;
          border-radius: 0.25rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .header {
          background: #1a1a1a;
          color: #FFF2CC;
          padding: 40px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        }
        .logo {
          font-family: 'Forum', Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: #FFF2CC;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          line-height: normal;
        }
        .tagline {
          color: #FFD65A;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .content {
          padding: 40px 32px;
          background: #101010;
          color: #EFE6D2;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
        }
        .greeting {
          font-family: 'Forum', Georgia, serif;
          font-size: 16px;
          margin-bottom: 24px;
          color: #FFF2CC;
          font-weight: 400;
          line-height: 1.6;
        }
        .cancellation-message {
          background: rgba(255, 100, 100, 0.1);
          border-left: 4px solid #ff6464;
          padding: 20px;
          margin: 24px 0;
          border-radius: 0.25rem;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          color: #EFE6D2;
          font-weight: 400;
          line-height: 1.6;
        }
        .cancelled-details {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          padding: 32px;
          margin: 32px 0;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .cancelled-details h3 {
          color: #FFF2CC;
          font-family: 'Forum', Georgia, serif;
          font-size: 24px;
          font-weight: 400;
          line-height: normal;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-family: 'Forum', Georgia, serif;
          font-weight: 400;
          color: #FFD65A;
          font-size: 14px;
          line-height: 1.6;
        }
        .detail-value {
          font-family: 'Forum', Georgia, serif;
          color: #EFE6D2;
          text-align: right;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.6;
        }
        .contact-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          padding: 32px;
          margin: 32px 0;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .contact-info h4 {
          color: #FFD65A;
          margin-top: 0;
          margin-bottom: 20px;
          font-family: 'Forum', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          line-height: normal;
        }
        .contact-info p {
          color: #EFE6D2;
          margin: 12px 0;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 400;
        }
        .footer {
          background: #1a1a1a;
          padding: 32px 24px;
          text-align: center;
          color: #EFE6D2;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
        }
        .footer p {
          margin: 12px 0;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .highlight {
          color: #FFD65A;
          font-weight: 400;
        }
        .reservation-button {
          display: inline-block;
          background: #FFD65A;
          color: #000000;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 0.25rem;
          font-family: 'Forum', Georgia, serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.6;
          margin: 24px 0;
          border: none;
          transition: all 0.3s ease;
          text-align: center;
          min-width: 200px;
        }
        .reservation-button:hover {
          background: #EFE6D2;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
          padding: 24px 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          margin: 32px 0;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 24px 20px;
          }
          .header {
            padding: 32px 20px;
          }
          .logo {
            font-size: 24px;
          }
          .cancelled-details, .contact-info {
            padding: 24px 20px;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .detail-value {
            text-align: left;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">Magnifiko Réservez</div>
          <div class="tagline">Reservation Cancelled</div>
        </div>

        <div class="content">
          <div class="greeting">
            Dear ${reservation.name},
          </div>

          <div class="cancellation-message">
            This email confirms that your reservation has been <span class="highlight">cancelled</span>. We're sorry to see you won't be joining us.
          </div>

          <div class="cancelled-details">
            <h3>Cancelled Reservation</h3>
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

          <div class="divider"></div>

          <p style="font-family: 'Forum', Georgia, serif; font-size: 14px; color: #EFE6D2; text-align: center; margin: 24px 0; line-height: 1.6;">
            We hope you'll consider dining with us in the future. If you'd like to make a new reservation, please visit our website or contact us directly.
          </p>

          <div class="contact-info">
            <h4>Ready to Book Again?</h4>
            <p>01 49 59 00 94</p>
            <p>compte.magnifiko@gmail.com</p>
            <p>63 Bd Paul Vaillant Couturier, 94200 Ivry-sur-Seine, France</p>
            <p>Lundi - Dimanche, 11h00 - 00h00 (Service continu)</p>
          </div>

          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="reservation-button">
              Make Another Reservation
            </a>
          </div>
        </div>

        <div class="footer">
          <p>We hope to see you at <span class="highlight">Magnifiko Réservez</span> soon!</p>
          <p style="font-size: 0.85em; opacity: 0.8; margin-top: 16px;">
            This is an automated cancellation email. Please do not reply to this email.
          </p>
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

// Generate HTML email template for submission acknowledgment
function generateSubmissionEmailHTML(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statusMessage = reservation.status === 'pending'
    ? "Your reservation request is being reviewed by our team. You'll receive a confirmation email once it's approved."
    : "Your reservation has been automatically confirmed!";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Request Received</title>
      <style>
        body {
          font-family: 'Forum', Georgia, serif;
          line-height: 1.6;
          color: #EFE6D2;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #000000;
          min-height: 100vh;
        }
        .email-container {
          background: #101010;
          border-radius: 0.25rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        .header {
          background: #1a1a1a;
          color: #FFF2CC;
          padding: 40px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        }
        .logo {
          font-family: 'Forum', Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: #FFF2CC;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          line-height: normal;
        }
        .tagline {
          color: #FFD65A;
          font-family: 'Forum', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .content {
          padding: 40px 32px;
          background: #ffffff;
          color: #2c3e50;
        }
        .greeting {
          font-size: 1.3em;
          margin-bottom: 24px;
          color: #2c3e50;
          font-weight: 600;
        }
        .submission-message {
          background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
          border-left: 4px solid #17a2b8;
          padding: 20px;
          margin: 24px 0;
          border-radius: 8px;
          font-size: 1.1em;
          color: #0c5460;
          font-weight: 500;
        }
        .status-message {
          background: linear-gradient(135deg, ${reservation.status === 'pending' ? '#fff3cd' : '#d4edda'} 0%, ${reservation.status === 'pending' ? '#ffeaa7' : '#c3e6cb'} 100%);
          border: 2px solid ${statusColor};
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
          text-align: center;
          position: relative;
        }
        .status-message::before {
          content: '${statusIcon}';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: ${statusColor};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1.2em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .status-message h4 {
          color: ${statusColor};
          margin: 0 0 12px 0;
          font-size: 1.2em;
          font-weight: 700;
        }
        .status-message p {
          color: ${reservation.status === 'pending' ? '#856404' : '#155724'};
          margin: 0;
          font-weight: 500;
        }
        .reservation-details {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          border: 2px solid #17a2b8;
          box-shadow: 0 8px 25px rgba(23, 162, 184, 0.15);
          position: relative;
        }
        .reservation-details::before {
          content: '📋';
          position: absolute;
          top: -15px;
          left: 30px;
          background: #17a2b8;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1.2em;
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(23, 162, 184, 0.2);
          transition: all 0.3s ease;
        }
        .detail-row:hover {
          background: rgba(23, 162, 184, 0.05);
          border-radius: 8px;
          padding-left: 12px;
          padding-right: 12px;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 700;
          color: #17a2b8;
          font-size: 1.05em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-value {
          color: #2c3e50;
          text-align: right;
          font-weight: 600;
          font-size: 1.05em;
        }
        .special-requests {
          background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
          border-radius: 16px;
          padding: 28px;
          margin: 32px 0;
          border: 2px solid #17a2b8;
          box-shadow: 0 8px 25px rgba(23, 162, 184, 0.15);
          position: relative;
        }
        .special-requests::before {
          content: '💬';
          position: absolute;
          top: -15px;
          left: 30px;
          background: #17a2b8;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1.2em;
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
        }
        .special-requests h4 {
          margin-top: 0;
          color: #17a2b8;
          font-size: 1.2em;
          font-weight: 700;
        }
        .next-steps {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          text-align: center;
          border: 2px solid #6c757d;
          box-shadow: 0 8px 25px rgba(108, 117, 125, 0.15);
          position: relative;
        }
        .next-steps::before {
          content: '📞';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #6c757d;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1.2em;
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
        .next-steps h4 {
          color: #6c757d;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.2em;
          font-weight: 700;
        }
        .next-steps p {
          color: #495057;
          margin: 12px 0;
          line-height: 1.6;
          font-weight: 500;
        }
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          padding: 32px 24px;
          text-align: center;
          color: #ecf0f1;
          font-size: 0.95em;
        }
        .footer p {
          margin: 12px 0;
          font-weight: 500;
        }
        .highlight {
          color: #17a2b8;
          font-weight: 700;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #17a2b8 50%, transparent 100%);
          margin: 32px 0;
          border-radius: 1px;
        }
        @media (max-width: 640px) {
          body {
            padding: 12px;
          }
          .content {
            padding: 24px 20px;
          }
          .header {
            padding: 32px 20px;
          }
          .logo {
            font-size: 2.2em;
          }
          .reservation-details, .special-requests, .status-message, .next-steps {
            padding: 24px 20px;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .detail-value {
            text-align: left;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">Magnifiko Réservez</div>
          <div class="tagline">Request Received</div>
        </div>

        <div class="content">
          <div style="text-align: center;">
            <div class="submission-icon">📨</div>
          </div>

          <div class="greeting">
            Dear ${reservation.name},
          </div>

          <div class="submission-message">
            🎉 Thank you for choosing <span class="highlight">Magnifiko Réservez</span>! We have successfully received your reservation request.
          </div>

          <div class="status-message">
            <h4>${reservation.status === 'pending' ? 'Under Review' : 'Confirmed!'}</h4>
            <p>${statusMessage}</p>
          </div>

          <div class="reservation-details">
            <h3 style="margin-top: 20px; color: #17a2b8; margin-bottom: 24px; font-size: 1.4em; font-weight: 700;">Your Request Details</h3>
            <div class="detail-row">
              <span class="detail-label">📋 Request ID:</span>
              <span class="detail-value">#${reservation.id?.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Time:</span>
              <span class="detail-value">${reservation.reservation_time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👥 Party Size:</span>
              <span class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Contact:</span>
              <span class="detail-value">${reservation.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">${reservation.email}</span>
            </div>
          </div>

          ${reservation.special_requests ? `
          <div class="special-requests">
            <h4>Special Requests</h4>
            <p style="margin-bottom: 0; color: #495057; font-weight: 500; line-height: 1.6;">${reservation.special_requests}</p>
          </div>
          ` : ''}

          <div class="divider"></div>

          <div class="next-steps">
            <h4>What Happens Next?</h4>
            ${reservation.status === 'pending' ? `
              <p>⏰ Our team will review your request within <strong>2 hours</strong> during business hours.</p>
              <p>📧 You'll receive a confirmation email once your reservation is approved.</p>
              <p>❓ If you have any questions, feel free to contact us directly.</p>
            ` : `
              <p>✅ Your reservation is <strong>confirmed</strong>! No further action needed.</p>
              <p>📧 You'll receive a reminder email on the day of your reservation.</p>
              <p>🍽️ We're excited to welcome you!</p>
            `}
            <div style="margin-top: 20px;">
              <p><strong>📞 (555) 123-4567</strong></p>
              <p><strong>📧 info@ochel.com</strong></p>
              <p>🕒 Open Tuesday-Sunday, 5:00 PM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing <span class="highlight">Magnifiko Réservez</span>! 🌟</p>
          <p style="font-size: 0.85em; opacity: 0.8; margin-top: 16px;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email for submission acknowledgment
function generateSubmissionEmailText(reservation: Reservation): string {
  const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statusMessage = reservation.status === 'pending'
    ? "Your reservation request is being reviewed by our team. You'll receive a confirmation email once it's approved."
    : "Your reservation has been automatically confirmed!";

  return `
    RESERVATION REQUEST RECEIVED - MAGNIFIKO RÉSERVEZ

    Dear ${reservation.name},

    Thank you for choosing Magnifiko Réservez! We have successfully received your reservation request.

    STATUS: ${reservation.status === 'pending' ? 'UNDER REVIEW' : 'CONFIRMED'}
    ${statusMessage}

    YOUR REQUEST DETAILS:
    Request ID: #${reservation.id?.slice(-8).toUpperCase()}
    Date: ${formattedDate}
    Time: ${reservation.reservation_time}
    Party Size: ${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}
    Contact: ${reservation.phone}
    Email: ${reservation.email}

    ${reservation.special_requests ? `SPECIAL REQUESTS:\n${reservation.special_requests}\n\n` : ''}

    WHAT HAPPENS NEXT:
    ${reservation.status === 'pending'
      ? `- Our team will review your request within 2 hours during business hours.
    - You'll receive a confirmation email once your reservation is approved.
    - If you have any questions, feel free to contact us directly.`
      : `- Your reservation is confirmed! No further action needed.
    - You'll receive a reminder email on the day of your reservation.
    - We're excited to welcome you!`
    }

    CONTACT US:
    Phone: (555) 123-4567
    Email: info@ochel.com
    Hours: Open Tuesday-Sunday, 5:00 PM - 11:00 PM

    Thank you for choosing Magnifiko Réservez!

    ---
    This is an automated confirmation email.
  `;
}