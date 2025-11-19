import { useCallback } from "react";
import useApi from "@/components/shared/hooks/useApi";
import { MOCK_LOCATIONS, MOCK_ROOMS, MOCK_MANAGERS } from "@/lib/mock-data";
import type { Location, Room, Manager } from "@/lib/mock-data";

interface DefaultDataResponse<T> {
  created: boolean;
  location?: T;
  room?: T;
  manager?: T;
}

const useDefaultData = () => {
  const api = useApi();

  const getDefaultData = useCallback(async () => {
    try {
      const [locationResponse, managerResponse, roomResponse] = await Promise.all([
        api.post<DefaultDataResponse<Location>>("/locations/get-or-create-default/", {}),
        api.post<DefaultDataResponse<Manager>>("/managers/get-or-create-default/", {}),
        api.post<DefaultDataResponse<Room>>("/rooms/get-or-create-default/", {}),
      ]);

      const [allLocations, allManagers, allRooms] = await Promise.all([
        api.get<Location[]>("/locations/").catch(() => []),
        api.get<Manager[]>("/managers/").catch(() => []),
        api.get<Room[]>("/rooms/").catch(() => []),
      ]);

      return {
        locations: allLocations.length > 0 ? allLocations : [locationResponse.location!],
        managers: allManagers.length > 0 ? allManagers : [managerResponse.manager!],
        rooms: allRooms.length > 0 ? allRooms : [roomResponse.room!],
        defaultIds: {
          locationId: locationResponse.location!.id,
          managerId: managerResponse.manager!.id,
          roomId: roomResponse.room!.id,
        },
      };
    } catch {
      // Fallback para dados mockados
      return {
        locations: MOCK_LOCATIONS,
        managers: MOCK_MANAGERS,
        rooms: MOCK_ROOMS,
        defaultIds: {
          locationId: MOCK_LOCATIONS[0]?.id,
          managerId: MOCK_MANAGERS[0]?.id,
          roomId: MOCK_ROOMS[0]?.id,
        },
      };
    }
  }, [api]);

  return {
    getDefaultData,
  };
};

export default useDefaultData;
