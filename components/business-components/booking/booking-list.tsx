import React from "react";
import { BookingCard } from "./booking-card";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export function BookingList({
  bookings,
  loading,
  onEdit,
  onDelete,
  onCreateNew,
}: BookingListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Nenhuma reserva encontrada"
        description="Não há reservas disponíveis no momento. Isso pode ser porque a API está indisponível ou não há dados cadastrados."
        action={{
          label: "Nova Reserva",
          onClick: onCreateNew,
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
