import React from "react";
import { Calendar, Clock, CheckCircle, Users } from "lucide-react";
import { StatCard } from "@/components/data-display/stat-card";

interface BookingStatsProps {
  bookings: Booking[];
}

export function BookingStats({ bookings }: BookingStatsProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const todaysBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.start_date);
    return bookingDate >= today && bookingDate < tomorrow;
  }).length;

  const ongoingBookings = bookings.filter((booking) => {
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    return startDate <= now && endDate >= now;
  }).length;

  const upcomingBookings = bookings.filter((booking) => {
    const startDate = new Date(booking.start_date);
    return startDate > now;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total" value={bookings.length} icon={Calendar} color="blue" />

      <StatCard title="Hoje" value={todaysBookings} icon={Clock} color="green" />

      <StatCard title="Em andamento" value={ongoingBookings} icon={CheckCircle} color="yellow" />

      <StatCard title="Próximas" value={upcomingBookings} icon={Users} color="purple" />
    </div>
  );
}
