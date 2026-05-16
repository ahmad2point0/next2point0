export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
