export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  accessToken?: string;
  refreshToken?: string;
  field?: "email" | "password";
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | string;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;
