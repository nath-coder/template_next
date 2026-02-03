// Tipos para la aplicación

export interface Customer {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}