interface Room {
  id: string;
  name: string;
  capacity: number;
  location_id: string;
}

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface Booking {
  id: string;
  room_id: string;
  manager_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  coffee_option: boolean;
  coffee_quantity: number;
  coffee_description: string | null;
  created_at: string;
  updated_at: string;
  room: Room;
  manager: Manager;
}

interface CreateBookingData {
  room: string;
  manager: string;
  start_date: string;
  end_date: string;
  coffee_option?: boolean;
  coffee_quantity?: number;
  coffee_description?: string;
}

type UpdateBookingData = Partial<CreateBookingData>;

interface BookingQueryParams {
  room_id?: string;
  manager_id?: string;
  start_date?: string;
  end_date?: string;
}

interface BookingFormData {
  locationId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  managerId: string;
  hasRefreshments: boolean;
  refreshmentQuantity: number;
  refreshmentDescription: string;
}
