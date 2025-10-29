export interface AuthResponse<T = any> {
  statusCode?: number;
  success?: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
}
