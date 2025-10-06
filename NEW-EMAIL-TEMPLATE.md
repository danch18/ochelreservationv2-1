# Updated Email Template for emailService.ts

Replace the `generateConfirmationEmailHTML` function in `/src/services/emailService.ts` (starting at line 145) with the template below.

The new template uses the dark theme design from `/src/app/email-preview/page.tsx` with:
- Dark background (#000000, #101010, #1a1a1a)
- Forum font family
- Beige/cream colors (#EFE6D2, #FFF2CC, #FFD65A)
- Updated contact information

## Instructions:

1. Open `/src/services/emailService.ts`
2. Find the function `generateConfirmationEmailHTML` (around line 146)
3. Replace the entire function body (from the opening `{` to closing `}`) with the code below

## The Updated Function:

```typescript
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
          color: #EFE6D2;
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
          color: #EFE6D2;
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
            font-size: 2.2em;
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
```

## What Changed:

1. **Colors**: Black background with beige/cream text instead of purple gradients
2. **Font**: Forum font family throughout
3. **Contact Info**: Updated to real restaurant information
4. **Design**: Simpler, more elegant dark theme
5. **Typography**: Consistent font sizes (14px body, 18-32px headings)

The backup of the original file is at `/src/services/emailService.ts.backup` in case you need to revert.
