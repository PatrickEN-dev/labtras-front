import { useCallback } from "react";
import { getMockRoomsByLocation, getMockAllRooms, MOCK_ROOMS, type Room } from "@/lib/mock-data";
import useApi from "@/components/generic-components/hooks/useApi";

interface RoomQueryParams {
  location_id?: string;
  capacity_min?: number;
  capacity_max?: number;
}

interface CreateRoomData {
  name: string;
  capacity?: number;
  location: string;
  description?: string;
}

interface UpdateRoomData {
  name?: string;
  capacity?: number;
  location?: string;
  description?: string;
}

const useRoomsApi = () => {
  const api = useApi();

  const getRooms = useCallback(
    async (params: RoomQueryParams = {}): Promise<Room[]> => {
      try {
        const buildQueryString = (params: RoomQueryParams): string => {
          const searchParams = new URLSearchParams();
          if (params.location_id) searchParams.append("location_id", params.location_id);
          if (params.capacity_min)
            searchParams.append("capacity_min", params.capacity_min.toString());
          if (params.capacity_max)
            searchParams.append("capacity_max", params.capacity_max.toString());
          const queryString = searchParams.toString();
          return queryString ? `?${queryString}` : "";
        };

        const realRooms = await api.get<Room[]>(`/rooms${buildQueryString(params)}/`);

        // Se há dados reais, usar apenas eles
        if (realRooms && realRooms.length > 0) {
          return realRooms;
        }
      } catch (error) {
      }

      // Fallback para dados mockados se API falhou ou não tem dados
      let rooms: Room[];

      if (params.location_id) {
        rooms = await getMockRoomsByLocation(params.location_id);
      } else {
        rooms = await getMockAllRooms();
      }

      if (params.capacity_min) {
        rooms = rooms.filter((room) => !room.capacity || room.capacity >= params.capacity_min!);
      }

      if (params.capacity_max) {
        rooms = rooms.filter((room) => !room.capacity || room.capacity <= params.capacity_max!);
      }

      return rooms;
    },
    [api]
  );

  const getRoom = useCallback(
    async (id: string): Promise<Room> => {
      try {
        const room = await api.get<Room>(`/rooms/${id}/`);
        return room;
      } catch (error) {

        const room = MOCK_ROOMS.find((r) => r.id === id);
        if (!room) {
          throw new Error("Room not found");
        }
        return room;
      }
    },
    [api]
  );

  const createRoom = useCallback(
    async (data: CreateRoomData): Promise<Room> => {
      try {
        const newRoom = await api.post<Room>("/rooms/", data);
        return newRoom;
      } catch (error) {

        const newRoom: Room = {
          id: `room-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return new Promise((resolve) => setTimeout(() => resolve(newRoom), 300));
      }
    },
    [api]
  );

  const updateRoom = useCallback(
    async (id: string, data: UpdateRoomData): Promise<Room> => {
      const room = await getRoom(id);
      const updatedRoom = {
        ...room,
        ...data,
        updated_at: new Date().toISOString(),
      };
      return new Promise((resolve) => setTimeout(() => resolve(updatedRoom), 300));
    },
    [getRoom]
  );

  const deleteRoom = useCallback(async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 200));
  }, []);

  const getAvailableRooms = useCallback(
    async (startDate: string, endDate: string, locationId?: string): Promise<Room[]> => {
      return getRooms(locationId ? { location_id: locationId } : {});
    },
    [getRooms]
  );

  return {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getAvailableRooms,
  };
};

export default useRoomsApi;
