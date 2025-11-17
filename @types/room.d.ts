interface Room extends BaseEntity {
  name: string;
  capacity?: number;
  location: string;
  description?: string;
}

interface RoomWithLocation extends Room {
  location_name?: string;
}

interface CreateRoomData {
  name: string;
  capacity?: number;
  location: string;
  description?: string;
}

type UpdateRoomData = Partial<CreateRoomData>;

interface RoomQueryParams {
  location_id?: string;
  capacity_min?: number;
  capacity_max?: number;
}
