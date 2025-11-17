interface Booking extends BaseEntity {
  room: string;
  manager: string;
  start_date: string;
  end_date: string;
  coffee_option: boolean;
  coffee_quantity?: number;
  coffee_description?: string;
  room_name?: string;
  room_location?: string;
  manager_name?: string;
  manager_email?: string;
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
