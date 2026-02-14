import { handleApiError } from "./handle-api-error";

export async function safeApi<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    handleApiError(error);
  }
}
