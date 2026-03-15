export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message?: string;
  errors?: { msg?: string; message?: string }[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginatedPayload<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
