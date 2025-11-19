import { useCallback } from "react";
import { getMockLocations, MOCK_LOCATIONS, type Location as MockLocation } from "@/lib/mock-data";
import useApi from "../useApi";

interface LocationQueryParams {
  search?: string;
}

interface CreateLocationData {
  name: string;
  address?: string;
  description?: string;
}

const useLocationsApi = () => {
  const api = useApi();

  const getLocations = useCallback(
    async (params: LocationQueryParams = {}): Promise<MockLocation[]> => {
      try {
        // Tentar API real primeiro
        const buildQueryString = (params: LocationQueryParams): string => {
          const searchParams = new URLSearchParams();
          if (params.search) searchParams.append("search", params.search);
          const queryString = searchParams.toString();
          return queryString ? `?${queryString}` : "";
        };

        const realLocations = await api.get<MockLocation[]>(
          `/locations${buildQueryString(params)}/`
        );
        if (realLocations && realLocations.length > 0) {
          return realLocations;
        }
      } catch {}

      let locations = await getMockLocations();

      if (params.search) {
        locations = locations.filter((location) =>
          location.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }

      return locations;
    },
    [api]
  );

  const getLocation = useCallback(
    async (id: string): Promise<MockLocation> => {
      const mockLocation = MOCK_LOCATIONS.find((l) => l.id === id);
      if (mockLocation) {
        return mockLocation;
      }

      try {
        const location = await api.get<MockLocation>(`/locations/${id}/`);
        return location;
      } catch {
        throw new Error("Location not found");
      }
    },
    [api]
  );

  const createLocation = useCallback(
    async (data: CreateLocationData): Promise<MockLocation> => {
      try {
        // Tentar criar via API real
        const newLocation = await api.post<MockLocation>("/locations/", data);
        return newLocation;
      } catch {
        // Fallback - simular criação
        const newLocation: MockLocation = {
          id: `loc-${Date.now()}`,
          ...data,
          address: data.address || "Endereço não informado",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return new Promise((resolve) => setTimeout(() => resolve(newLocation), 300));
      }
    },
    [api]
  );

  return {
    getLocations,
    getLocation,
    createLocation,
  };
};

export default useLocationsApi;
