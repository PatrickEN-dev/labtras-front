import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Coffee, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingCardProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const getBookingStatus = (booking: Booking) => {
    const now = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);

    if (endDate < now) return { label: "Finalizada", color: "bg-gray-500" };
    if (startDate <= now && endDate >= now) return { label: "Em andamento", color: "bg-green-500" };
    return { label: "Agendada", color: "bg-blue-500" };
  };

  const startDateTime = formatDateTime(booking.start_date);
  const endDateTime = formatDateTime(booking.end_date);
  const status = getBookingStatus(booking);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${status.color}`}
              >
                {status.label}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.name || "Reunião sem título"}
              </h3>
            </div>

            {booking.description && (
              <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                {booking.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <div>
                  <p className="font-medium">{booking.room.name}</p>
                  <p className="text-xs text-gray-500">
                    Capacidade: {booking.room.capacity} pessoas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="font-medium">Início</p>
                  <p className="text-xs text-gray-500">{startDateTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div>
                  <p className="font-medium">Término</p>
                  <p className="text-xs text-gray-500">{endDateTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <p className="font-medium">{booking.manager.name}</p>
                  <p className="text-xs text-gray-500">{booking.manager.email}</p>
                </div>
              </div>
            </div>

            {booking.coffee_description && (
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Detalhes do Coffee Break
                </span>
                <p className="text-sm text-gray-700 mt-1">{booking.coffee_description}</p>
              </div>
            )}

            {booking.coffee_option && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Coffee className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 font-medium">Coffee break incluído</span>
                {booking.coffee_quantity && booking.coffee_quantity > 0 && (
                  <span className="text-gray-500">({booking.coffee_quantity} pessoas)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(booking)}
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(booking.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
