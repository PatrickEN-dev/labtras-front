import { useCallback, useMemo } from "react";
import useApi from "@/components/generic-components/hooks/useApi";

const useBookingsApi = () => {
  const api = useApi();

  const buildQueryString = useCallback((params: BookingQueryParams): string => {
    const searchParams = new URLSearchParams();

    if (params.room_id) searchParams.append("room_id", params.room_id);
    if (params.manager_id) searchParams.append("manager_id", params.manager_id);
    if (params.start_date) searchParams.append("start_date", params.start_date);
    if (params.end_date) searchParams.append("end_date", params.end_date);

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }, []);

  const getBookings = useCallback(
    (params: BookingQueryParams = {}) =>
      api.get<Booking[]>(`/api/bookings${buildQueryString(params)}`),
    [api, buildQueryString]
  );

  const getBooking = useCallback((id: string) => api.get<Booking>(`/api/bookings/${id}`), [api]);

  const createBooking = useCallback(
    (data: CreateBookingData) => api.post<Booking>("/api/bookings", data),
    [api]
  );

  const updateBooking = useCallback(
    (id: string, data: UpdateBookingData) => api.put<Booking>(`/api/bookings/${id}`, data),
    [api]
  );

  const deleteBooking = useCallback((id: string) => api.delete<void>(`/api/bookings/${id}`), [api]);

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
