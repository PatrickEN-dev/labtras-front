import { useCallback, useMemo } from "react";
import useApi from "@/components/generic-components/hooks/useApi";

const useLocationsApi = () => {
  const api = useApi();

  const buildQueryString = useCallback((params: LocationQueryParams): string => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }, []);

  const getLocations = useCallback(
    (params: LocationQueryParams = {}) =>
      api.get<Location[]>(`/api/locations${buildQueryString(params)}`),
    [api, buildQueryString]
  );

  const getLocation = useCallback((id: string) => api.get<Location>(`/api/locations/${id}`), [api]);

  const createLocation = useCallback(
    (data: CreateLocationData) => api.post<Location>("/api/locations", data),
    [api]
  );

  const updateLocation = useCallback(
    (id: string, data: UpdateLocationData) => api.put<Location>(`/api/locations/${id}`, data),
    [api]
  );

  const deleteLocation = useCallback(
    (id: string) => api.delete<void>(`/api/locations/${id}`),
    [api]
  );

  return useMemo(
    () => ({
      getLocations,
      getLocation,
      createLocation,
      updateLocation,
      deleteLocation,
    }),
    [getLocations, getLocation, createLocation, updateLocation, deleteLocation]
  );
};

export default useLocationsApi;
