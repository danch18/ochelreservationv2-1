'use client';

import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { RESTAURANT_CONFIG, TIME_SLOTS } from '@/lib/constants';

export function SettingsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground mb-2">Restaurant Settings</h2>
        <p className="text-muted-foreground">
          View and manage your restaurant configuration and operating hours.
        </p>
      </div>

      {/* Restaurant Information */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-card-foreground">Restaurant Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Restaurant Name</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Phone</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Email</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Hours</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.hours}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-card-foreground">Address</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.address}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-card-foreground">Description</label>
              <p className="text-muted-foreground">{RESTAURANT_CONFIG.tagline}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots Configuration */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-card-foreground">Available Time Slots</h3>
          <p className="text-sm text-muted-foreground">
            Current reservation time slots available to customers.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded text-center text-sm font-medium"
              >
                {time}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Total: {TIME_SLOTS.length} time slots available (30-minute intervals)
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-card-foreground">System Configuration</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Maximum Guests per Reservation</label>
              <p className="text-muted-foreground">8 guests</p>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Minimum Advance Booking</label>
              <p className="text-muted-foreground">Same day (today onwards)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Reservation Status Options</label>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs">Confirmed</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-xs">Completed</span>
                <span className="px-2 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded text-xs">Cancelled</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Database Provider</label>
              <p className="text-muted-foreground">Supabase</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm">
              Export Reservations
            </Button>
            <Button variant="secondary" size="sm">
              View Analytics
            </Button>
            <Button variant="secondary" size="sm">
              Backup Data
            </Button>
            <Button variant="outline" size="sm">
              System Settings
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: To modify restaurant information or time slots, update the constants in the application configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
