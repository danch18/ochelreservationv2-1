import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { reservationId, adminUserId } = await request.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    // Get the reservation details first
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (fetchError || !reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    if (reservation.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Reservation is already confirmed' },
        { status: 400 }
      );
    }

    // Update reservation status to confirmed
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservations')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: adminUserId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating reservation:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm reservation' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      await emailService.sendAdminConfirmationEmail(updatedReservation);
      console.log('✅ Confirmation email sent to:', reservation.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError);
      // Don't fail the confirmation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation confirmed successfully and confirmation email sent',
      reservation: updatedReservation
    });

  } catch (error) {
    console.error('Reservation confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
