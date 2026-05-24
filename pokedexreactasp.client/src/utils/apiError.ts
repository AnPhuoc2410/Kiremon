interface BackendValidationErrors {
  [key: string]: string[];
}

interface BackendErrorPayload {
  message?: string;
  title?: string;
  errors?: BackendValidationErrors;
}

interface AxiosLikeError {
  message?: string;
  response?: {
    status?: number;
    data?: BackendErrorPayload;
  };
}

const flattenValidationErrors = (errors?: BackendValidationErrors): string[] => {
  if (!errors) return [];

  return Object.entries(errors)
    .flatMap(([field, messages]) =>
      messages.map((msg) => `${field}: ${msg}`),
    )
    .filter(Boolean);
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Request failed. Please try again.",
): string => {
  const err = error as AxiosLikeError;

  const status = err?.response?.status;
  const data = err?.response?.data;

  if (status === 429) {
    return "Too many requests. Please wait a minute and try again.";
  }

  // Browser-level failures (CORS blocked, server down, TLS issue) often have no response.
  if (!err?.response) {
    const message = (err?.message || "").toLowerCase();
    if (message.includes("network")) {
      return "Network/CORS error: request was blocked or server is unreachable. Check backend CORS AllowedOrigins and API URL.";
    }
  }

  const validationLines = flattenValidationErrors(data?.errors);
  if (validationLines.length > 0) {
    return validationLines.join("\n");
  }

  if (data?.message && data.message.trim().length > 0) {
    return data.message;
  }

  if (data?.title && data.title.trim().length > 0) {
    return data.title;
  }

  if (err?.message && err.message.trim().length > 0) {
    return err.message;
  }

  return fallback;
};
