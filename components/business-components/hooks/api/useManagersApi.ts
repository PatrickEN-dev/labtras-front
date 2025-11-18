import { useCallback } from "react";
import { getMockManagers, MOCK_MANAGERS, type Manager } from "@/lib/mock-data";
import useApi from "@/components/generic-components/hooks/useApi";

interface ManagerQueryParams {
  search?: string;
  email?: string;
}

interface CreateManagerData {
  name: string;
  email: string;
  phone?: string;
}

interface UpdateManagerData {
  name?: string;
  email?: string;
  phone?: string;
}

const useManagersApi = () => {
  const api = useApi();

  const getManagers = useCallback(
    async (params: ManagerQueryParams = {}): Promise<Manager[]> => {
      try {
        const buildQueryString = (params: ManagerQueryParams): string => {
          const searchParams = new URLSearchParams();
          if (params.search) searchParams.append("search", params.search);
          if (params.email) searchParams.append("email", params.email);
          const queryString = searchParams.toString();
          return queryString ? `?${queryString}` : "";
        };

        const realManagers = await api.get<Manager[]>(`/managers${buildQueryString(params)}`);

        // Se há dados reais, usar apenas eles
        if (realManagers && realManagers.length > 0) {
          return realManagers;
        }
      } catch (error) {
      }

      const managers = await getMockManagers();

      if (params.search) {
        return managers.filter(
          (manager: Manager) =>
            manager.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            manager.email.toLowerCase().includes(params.search!.toLowerCase())
        );
      }

      if (params.email) {
        return managers.filter((manager: Manager) =>
          manager.email.toLowerCase().includes(params.email!.toLowerCase())
        );
      }

      return managers;
    },
    [api]
  );

  const getManager = useCallback(
    async (id: string): Promise<Manager> => {
      try {
        // Tentar API real primeiro
        const manager = await api.get<Manager>(`/managers/${id}/`);
        return manager;
      } catch (error) {
        // Fallback para dados mockados
        const manager = MOCK_MANAGERS.find((m: Manager) => m.id === id);
        if (!manager) {
          throw new Error("Manager not found");
        }
        return manager;
      }
    },
    [api]
  );

  const createManager = useCallback(
    async (data: CreateManagerData): Promise<Manager> => {
      try {
        // Tentar criar via API real
        const newManager = await api.post<Manager>("/managers/", data);
        return newManager;
      } catch (error) {
        // Fallback - simular criação
        const newManager: Manager = {
          id: `mgr-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return new Promise((resolve) => setTimeout(() => resolve(newManager), 300));
      }
    },
    [api]
  );

  const updateManager = useCallback(
    async (id: string, data: UpdateManagerData): Promise<Manager> => {
      const manager = await getManager(id);
      const updatedManager = {
        ...manager,
        ...data,
        updated_at: new Date().toISOString(),
      };
      return new Promise((resolve) => setTimeout(() => resolve(updatedManager), 300));
    },
    [getManager]
  );

  const deleteManager = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 200));
  }, []);

  const getManagerByEmail = useCallback(async (email: string): Promise<Manager> => {
    const manager = MOCK_MANAGERS.find(
      (m: Manager) => m.email.toLowerCase() === email.toLowerCase()
    );
    if (!manager) {
      throw new Error("Manager not found");
    }
    return manager;
  }, []);

  return {
    getManagers,
    getManager,
    createManager,
    updateManager,
    deleteManager,
    getManagerByEmail,
  };
};

export default useManagersApi;
