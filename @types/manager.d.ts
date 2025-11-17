interface Manager extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
}

interface CreateManagerData {
  name: string;
  email: string;
  phone?: string;
}

type UpdateManagerData = Partial<CreateManagerData>;

interface ManagerQueryParams {
  search?: string;
  email?: string;
}
