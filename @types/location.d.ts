interface Location extends BaseEntity {
  name: string;
  address?: string;
  description?: string;
}

interface CreateLocationData {
  name: string;
  address?: string;
  description?: string;
}

type UpdateLocationData = Partial<CreateLocationData>;

interface LocationQueryParams {
  search?: string;
}
