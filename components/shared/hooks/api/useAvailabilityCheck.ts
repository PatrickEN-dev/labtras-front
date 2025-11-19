import { useCallback, useMemo } from "react";
import useApi from "../useApi";

interface AvailabilityParams {
  roomId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  excludeBookingId?: string; // Para edição, excluir o booking atual
}

interface AvailabilityResult {
  available: boolean;
  conflictingBookings: Booking[];
  suggestedSlots: TimeSlot[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

interface OccupiedSlot {
  start: string;
  end: string;
  booking: Booking;
}

const useAvailabilityCheck = () => {
  const api = useApi();

  const checkAvailability = useCallback(
    async (params: AvailabilityParams): Promise<AvailabilityResult> => {
      try {
        if (!params.roomId || !params.date || !params.startTime || !params.endTime) {
          return {
            available: true,
            conflictingBookings: [],
            suggestedSlots: [],
          };
        }

        // Buscar todas as reservas da sala na data específica
        const startOfDay = `${params.date}T00:00:00`;
        const endOfDay = `${params.date}T23:59:59`;

        const bookings = await api.get<Booking[]>(
          `/bookings?room_id=${params.roomId}&start_date=${startOfDay}&end_date=${endOfDay}`
        );

        // Filtrar booking atual se estivermos editando
        const relevantBookings = params.excludeBookingId
          ? bookings.filter((booking) => booking.id !== params.excludeBookingId)
          : bookings;

        // Verificar se há conflito
        const requestedStart = new Date(`${params.date}T${params.startTime}:00`);
        const requestedEnd = new Date(`${params.date}T${params.endTime}:00`);

        const conflictingBookings = relevantBookings.filter((booking) => {
          const bookingStart = new Date(booking.start_date);
          const bookingEnd = new Date(booking.end_date);

          // Verificar sobreposição: novo início < fim existente E novo fim > início existente
          return requestedStart < bookingEnd && requestedEnd > bookingStart;
        });

        const available = conflictingBookings.length === 0;

        // Gerar sugestões se não disponível
        const suggestedSlots = available
          ? []
          : generateSuggestedSlots(relevantBookings, params.date, params.startTime, params.endTime);

        return {
          available,
          conflictingBookings,
          suggestedSlots,
        };
      } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        return {
          available: true, // Em caso de erro, assumir disponível para não bloquear
          conflictingBookings: [],
          suggestedSlots: [],
        };
      }
    },
    [api]
  );

  const getOccupiedSlots = useCallback(
    async (roomId: string, date: string): Promise<OccupiedSlot[]> => {
      try {
        const startOfDay = `${date}T00:00:00`;
        const endOfDay = `${date}T23:59:59`;

        const bookings = await api.get<Booking[]>(
          `/bookings?room_id=${roomId}&start_date=${startOfDay}&end_date=${endOfDay}`
        );

        return bookings.map((booking) => ({
          start: new Date(booking.start_date).toTimeString().slice(0, 5),
          end: new Date(booking.end_date).toTimeString().slice(0, 5),
          booking,
        }));
      } catch (error) {
        console.error("Erro ao buscar slots ocupados:", error);
        return [];
      }
    },
    [api]
  );

  return useMemo(
    () => ({
      checkAvailability,
      getOccupiedSlots,
    }),
    [checkAvailability, getOccupiedSlots]
  );
};

// Função para gerar sugestões de horários
function generateSuggestedSlots(
  bookings: Booking[],
  date: string,
  requestedStart: string,
  requestedEnd: string
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Converter horários para minutos para facilitar cálculos
  const requestedStartMinutes = timeToMinutes(requestedStart);
  const requestedEndMinutes = timeToMinutes(requestedEnd);
  const duration = requestedEndMinutes - requestedStartMinutes;

  // Criar lista de intervalos ocupados
  const occupiedSlots = bookings
    .map((booking) => ({
      start: timeToMinutes(new Date(booking.start_date).toTimeString().slice(0, 5)),
      end: timeToMinutes(new Date(booking.end_date).toTimeString().slice(0, 5)),
    }))
    .sort((a, b) => a.start - b.start);

  // Horário comercial: 8:00 às 18:00
  const workStart = timeToMinutes("08:00");
  const workEnd = timeToMinutes("18:00");

  // Verificar slots livres
  let currentTime = workStart;

  for (const occupied of occupiedSlots) {
    // Verificar se há espaço antes do próximo agendamento
    if (currentTime + duration <= occupied.start) {
      // Gerar sugestões neste espaço livre
      let slotStart = currentTime;
      while (slotStart + duration <= occupied.start) {
        slots.push({
          startTime: minutesToTime(slotStart),
          endTime: minutesToTime(slotStart + duration),
          available: true,
        });
        slotStart += 30; // Incrementos de 30 minutos

        if (slots.length >= 3) break; // Limitar a 3 sugestões por gap
      }
    }
    currentTime = Math.max(currentTime, occupied.end);
  }

  // Verificar espaço após o último agendamento
  if (currentTime + duration <= workEnd) {
    let slotStart = currentTime;
    while (slotStart + duration <= workEnd && slots.length < 6) {
      slots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotStart + duration),
        available: true,
      });
      slotStart += 30;
    }
  }

  // Sugestões para o próximo dia útil se não houver slots hoje
  if (slots.length === 0) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    slots.push({
      startTime: requestedStart,
      endTime: requestedEnd,
      available: true,
      reason: `Disponível amanhã (${tomorrow.toLocaleDateString("pt-BR")})`,
    });
  }

  return slots.slice(0, 6); // Máximo 6 sugestões
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export default useAvailabilityCheck;
