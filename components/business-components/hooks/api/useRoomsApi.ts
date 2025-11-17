import { useCallback, useMemo } from "react";
import useApi from "@/components/generic-components/hooks/useApi";

const useRoomsApi = () => {
  const api = useApi();

  const buildQueryString = useCallback((params: RoomQueryParams): string => {
    const searchParams = new URLSearchParams();

    if (params.location_id) searchParams.append("location_id", params.location_id);
    if (params.capacity_min) searchParams.append("capacity_min", params.capacity_min.toString());
    if (params.capacity_max) searchParams.append("capacity_max", params.capacity_max.toString());

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }, []);

  const getRooms = useCallback(
    (params: RoomQueryParams = {}) =>
      api.get<RoomWithLocation[]>(`/api/rooms${buildQueryString(params)}`),
    [api, buildQueryString]
  );

  const getRoom = useCallback((id: string) => api.get<RoomWithLocation>(`/api/rooms/${id}`), [api]);

  const createRoom = useCallback(
    (data: CreateRoomData) => api.post<Room>("/api/rooms", data),
    [api]
  );

  const updateRoom = useCallback(
    (id: string, data: UpdateRoomData) => api.put<Room>(`/api/rooms/${id}`, data),
    [api]
  );

  const deleteRoom = useCallback((id: string) => api.delete<void>(`/api/rooms/${id}`), [api]);

  const getAvailableRooms = useCallback(
    (startDate: string, endDate: string, locationId?: string) => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      if (locationId) params.append("location_id", locationId);

      return api.get<RoomWithLocation[]>(`/api/rooms/available?${params.toString()}`);
    },
    [api]
  );

  return useMemo(
    () => ({
      getRooms,
      getRoom,
      createRoom,
      updateRoom,
      deleteRoom,
      getAvailableRooms,
    }),
    [getRooms, getRoom, createRoom, updateRoom, deleteRoom, getAvailableRooms]
  );
};

export default useRoomsApi;
