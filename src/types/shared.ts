export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  meta: {
    request_id: string;
    timestamp: string;
  };
  http_status: number;
  data: T;
};

export type PaginatedResult<T> = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  results: T[];
};
