import { useCallback, useMemo } from "react";
import useApi from "@/components/generic-components/hooks/useApi";

const useManagersApi = () => {
  const api = useApi();

  const buildQueryString = useCallback((params: ManagerQueryParams): string => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);
    if (params.email) searchParams.append("email", params.email);

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }, []);

  const getManagers = useCallback(
    (params: ManagerQueryParams = {}) =>
      api.get<Manager[]>(`/api/managers${buildQueryString(params)}`),
    [api, buildQueryString]
  );

  const getManager = useCallback((id: string) => api.get<Manager>(`/api/managers/${id}`), [api]);

  const createManager = useCallback(
    (data: CreateManagerData) => api.post<Manager>("/api/managers", data),
    [api]
  );

  const updateManager = useCallback(
    (id: string, data: UpdateManagerData) => api.put<Manager>(`/api/managers/${id}`, data),
    [api]
  );

  const deleteManager = useCallback((id: string) => api.delete<void>(`/api/managers/${id}`), [api]);

  const getManagerByEmail = useCallback(
    (email: string) => api.get<Manager>(`/api/managers/email/${encodeURIComponent(email)}`),
    [api]
  );

  return useMemo(
    () => ({
      getManagers,
      getManager,
      createManager,
      updateManager,
      deleteManager,
      getManagerByEmail,
    }),
    [getManagers, getManager, createManager, updateManager, deleteManager, getManagerByEmail]
  );
};

export default useManagersApi;
