interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
  status: number;
}
