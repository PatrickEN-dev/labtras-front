import { useCallback, useMemo } from "react";
import useApi from "../useApi";

interface BookingQueryParams {
  room_id?: string;
  manager_id?: string;
  start_date?: string;
  end_date?: string;
}

interface CreateBookingData {
  room: string;
  manager: string;
  start_datetime: string;
  end_datetime: string;
  name?: string;
  description?: string;
  purpose?: string;
  coffee_option?: boolean;
  coffee_quantity?: number;
  coffee_description?: string;
}

type UpdateBookingData = Partial<CreateBookingData>;

const useBookingsApi = () => {
  const api = useApi();

  const getBookings = useCallback(
    async (params: BookingQueryParams = {}): Promise<Booking[]> => {
      try {
        const buildQueryString = (params: BookingQueryParams): string => {
          const searchParams = new URLSearchParams();
          if (params.room_id) searchParams.append("room_id", params.room_id);
          if (params.manager_id) searchParams.append("manager_id", params.manager_id);
          if (params.start_date) searchParams.append("start_date", params.start_date);
          if (params.end_date) searchParams.append("end_date", params.end_date);
          const queryString = searchParams.toString();
          return queryString ? `?${queryString}` : "";
        };

        const bookings = await api.get<Booking[]>(`/bookings${buildQueryString(params)}`);
        return bookings;
      } catch {
        return [];
      }
    },
    [api]
  );

  const getBooking = useCallback(
    async (id: string): Promise<Booking> => {
      try {
        const booking = await api.get<Booking>(`/bookings/${id}/`);
        return booking;
      } catch {
        throw new Error("Booking não encontrado na API");
      }
    },
    [api]
  );

  const createBooking = useCallback(
    async (data: CreateBookingData): Promise<Booking> => {
      try {
        const booking = await api.post<Booking>("/bookings/", data);
        return booking;
      } catch {
        throw new Error("Não foi possível criar o booking");
      }
    },
    [api]
  );

  const updateBooking = useCallback(
    async (id: string, data: UpdateBookingData): Promise<Booking> => {
      try {
        console.log("Atualizando booking com ID:", id);
        console.log("Dados para atualização:", data);

        const booking = await api.put<Booking>(`/bookings/${id}/`, data);

        console.log("Booking atualizado com sucesso:", booking);
        return booking;
      } catch (error) {
        console.error("Erro ao atualizar booking:", error);
        throw new Error("Não foi possível atualizar o booking");
      }
    },
    [api]
  );

  const deleteBooking = useCallback(
    async (id: string): Promise<void> => {
      try {
        await api.delete<void>(`/bookings/${id}/`);
      } catch {
        throw new Error("Não foi possível deletar o booking");
      }
    },
    [api]
  );

  return useMemo(
    () => ({
      getBookings,
      getBooking,
      createBooking,
      updateBooking,
      deleteBooking,
    }),
    [getBookings, getBooking, createBooking, updateBooking, deleteBooking]
  );
};

export default useBookingsApi;
