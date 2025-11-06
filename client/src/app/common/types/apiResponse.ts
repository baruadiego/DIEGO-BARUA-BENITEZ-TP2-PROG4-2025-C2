export interface ApiResponse<T = any> {
  statusCode?: number;
  success?: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
  page?: number;
  totalPages?: number;
}
