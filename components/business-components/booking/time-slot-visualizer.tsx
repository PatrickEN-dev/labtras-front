import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OccupiedSlot {
  start: string;
  end: string;
  booking: Booking;
}

interface TimeSlotVisualizerProps {
  occupiedSlots: OccupiedSlot[];
  selectedStart?: string;
  selectedEnd?: string;
  roomName?: string;
  date?: string;
}

export function TimeSlotVisualizer({
  occupiedSlots,
  selectedStart,
  selectedEnd,
  roomName,
  date,
}: TimeSlotVisualizerProps) {
  const timeSlots = useMemo(() => {
    const slots = [];
    const workStart = 8; // 8:00
    const workEnd = 18; // 18:00

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endTimeStr =
          minute === 30
            ? `${(hour + 1).toString().padStart(2, "0")}:00`
            : `${hour.toString().padStart(2, "0")}:30`;

        const isOccupied = occupiedSlots.some((slot) => {
          const slotStart = timeToMinutes(slot.start);
          const slotEnd = timeToMinutes(slot.end);
          const currentStart = timeToMinutes(timeStr);
          const currentEnd = timeToMinutes(endTimeStr);

          return currentStart < slotEnd && currentEnd > slotStart;
        });

        const isSelected =
          selectedStart &&
          selectedEnd &&
          timeToMinutes(timeStr) >= timeToMinutes(selectedStart) &&
          timeToMinutes(endTimeStr) <= timeToMinutes(selectedEnd);

        const occupiedSlot = occupiedSlots.find((slot) => {
          const slotStart = timeToMinutes(slot.start);
          const slotEnd = timeToMinutes(slot.end);
          const currentStart = timeToMinutes(timeStr);
          const currentEnd = timeToMinutes(endTimeStr);

          return currentStart < slotEnd && currentEnd > slotStart;
        });

        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          isOccupied,
          isSelected,
          booking: occupiedSlot?.booking,
        });
      }
    }

    return slots;
  }, [occupiedSlots, selectedStart, selectedEnd]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Data não selecionada";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          Disponibilidade de Horários
        </CardTitle>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Sala:</strong> {roomName || "Nenhuma sala selecionada"}
          </p>
          <p>
            <strong>Data:</strong> {formatDate(date)}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Selecionado</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-h-60 overflow-y-auto">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`
                relative p-2 rounded-md border text-xs text-center transition-all duration-200 cursor-pointer
                ${
                  slot.isSelected
                    ? "bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-blue-200"
                    : slot.isOccupied
                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                }
              `}
              title={
                slot.isOccupied && slot.booking
                  ? `Ocupado: ${slot.booking.name} (${slot.booking.manager.name})`
                  : slot.isSelected
                  ? "Horário selecionado"
                  : "Disponível"
              }
            >
              <div className="font-medium">{slot.time}</div>
              {slot.isOccupied && <AlertCircle className="h-3 w-3 mx-auto mt-1 text-red-500" />}
              {slot.isSelected && <CheckCircle className="h-3 w-3 mx-auto mt-1 text-blue-500" />}
            </div>
          ))}
        </div>

        {occupiedSlots.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Reuniões Agendadas:</h4>
            <div className="space-y-2">
              {occupiedSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-red-700">{slot.booking.name}</div>
                    <div className="text-xs text-red-600">{slot.booking.manager.name}</div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {slot.start} - {slot.end}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
