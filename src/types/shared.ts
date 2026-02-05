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
