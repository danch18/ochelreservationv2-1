import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/services/emailService';
import type { Reservation } from '@/types';

/**
 * API Route: Send Daily Reminder Emails
 *
 * This endpoint sends reminder emails to all customers who have reservations today.
 * It should be triggered daily at 9:00 AM via a cron job.
 *
 * Security: Protected by authorization header (optional but recommended)
 *
 * Usage:
 * - Vercel Cron: Add to vercel.json
 * - Manual trigger: POST /api/cron/send-daily-reminders
 * - With auth: Include Authorization header with CRON_SECRET
 */

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    console.log(`[Daily Reminders] Running for date: ${today}`);

    // Fetch all confirmed reservations for today
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('reservation_date', today)
      .eq('status', 'confirmed')
      .order('reservation_time', { ascending: true });

    if (error) {
      console.error('[Daily Reminders] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reservations', details: error.message },
        { status: 500 }
      );
    }

    if (!reservations || reservations.length === 0) {
      console.log('[Daily Reminders] No reservations found for today');
      return NextResponse.json({
        success: true,
        message: 'No reservations for today',
        count: 0,
        date: today
      });
    }

    console.log(`[Daily Reminders] Found ${reservations.length} reservations`);

    // Send reminder emails to all customers
    const results = await Promise.allSettled(
      reservations.map(async (reservation: Reservation) => {
        try {
          await emailService.sendDailyReminder(reservation);
          console.log(`[Daily Reminders] ✅ Sent to ${reservation.email} (${reservation.name})`);
          return { success: true, email: reservation.email, id: reservation.id };
        } catch (error) {
          console.error(`[Daily Reminders] ❌ Failed for ${reservation.email}:`, error);
          return {
            success: false,
            email: reservation.email,
            id: reservation.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

    console.log(`[Daily Reminders] Completed: ${successful} sent, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: `Daily reminders sent successfully`,
      date: today,
      total: reservations.length,
      sent: successful,
      failed: failed,
      details: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' })
    });

  } catch (error) {
    console.error('[Daily Reminders] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing/manual trigger (optional)
export async function GET(request: NextRequest) {
  // For security, you might want to require auth here too
  console.log('[Daily Reminders] GET request - redirecting to POST');
  return POST(request);
}
