export type ApiResponse<T> = {
  message: string;
  statusCode: number;
  isSuccess: boolean;
  reason: string | null;
  data: T | null;
};
export const POKEMON_API = import.meta.env.VITE_POKEMON_API || "";
export const POKEMON_IMAGE = import.meta.env.VITE_POKEMON_IMAGE || "";
