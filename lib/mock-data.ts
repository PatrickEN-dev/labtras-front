export interface Location {
  id: string;
  name: string;
  address: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity?: number;
  location: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-1",
    name: "Matriz - Centro",
    address: "Av. Principal, 123, Centro",
    description: "Edifício corporativo principal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "loc-2",
    name: "Filial - Zona Sul",
    address: "Rua das Flores, 456, Zona Sul",
    description: "Filial zona sul",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "loc-3",
    name: "Filial - Zona Norte",
    address: "Av. Industrial, 789, Zona Norte",
    description: "Filial zona norte",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: "room-1",
    name: "Sala de Reunião A",
    capacity: 8,
    location: "loc-1",
    description: "Sala pequena para reuniões rápidas",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "room-2",
    name: "Sala de Reunião B",
    capacity: 12,
    location: "loc-1",
    description: "Sala média para reuniões em grupo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "room-3",
    name: "Auditório Principal",
    capacity: 50,
    location: "loc-1",
    description: "Auditório para eventos e apresentações",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "room-4",
    name: "Sala Zona Sul - 1",
    capacity: 6,
    location: "loc-2",
    description: "Sala compacta filial zona sul",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "room-5",
    name: "Sala Zona Sul - 2",
    capacity: 10,
    location: "loc-2",
    description: "Sala média filial zona sul",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "room-6",
    name: "Sala Zona Norte - 1",
    capacity: 8,
    location: "loc-3",
    description: "Sala filial zona norte",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_MANAGERS: Manager[] = [
  {
    id: "mgr-1",
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "(11) 99999-1111",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mgr-2",
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    phone: "(11) 99999-2222",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mgr-3",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@empresa.com",
    phone: "(11) 99999-3333",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getMockLocations = async (): Promise<Location[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LOCATIONS;
};

export const getMockLocationById = async (id: string): Promise<Location | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LOCATIONS.find((location) => location.id === id) || null;
};

export const getMockRoomsByLocation = async (locationId: string): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_ROOMS.filter((room) => room.location === locationId);
};

export const getMockAllRooms = async (): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_ROOMS;
};

export const getMockRoomById = async (id: string): Promise<Room | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_ROOMS.find((room) => room.id === id) || null;
};

export const getMockManagers = async (): Promise<Manager[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_MANAGERS;
};

export const getMockManagerById = async (id: string): Promise<Manager | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_MANAGERS.find((manager) => manager.id === id) || null;
};
