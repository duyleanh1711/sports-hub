import axios from "axios";

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const code =
      error.response?.data?.code ||
      error.response?.data?.message ||
      error.message ||
      "UNKNOWN_ERROR";

    console.error("API ERROR:", error.response?.data || error.message);

    throw new Error(code);
  }

  throw error;
}
