// Utility functions for handling API error responses

export interface ApiErrorResponse {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  errors?: Array<{
    key: string;
    value: string;
  }>;
}

/**
 * Extract error message from API response with errors array
 * @param error - The error object from catch block
 * @returns The extracted error message or a default message
 */
export const extractErrorMessage = (error: unknown): string => {
  // First, check if error is already the response data (from axios interceptor)
  const directErrorResponse = error as ApiErrorResponse;
  if (
    directErrorResponse?.errors &&
    Array.isArray(directErrorResponse.errors)
  ) {
    const firstError = directErrorResponse.errors[0];
    if (firstError?.value) {
      return firstError.value;
    }
  }

  // Check if it's a direct error response with message
  if (directErrorResponse?.message) {
    return directErrorResponse.message;
  }

  // Check if it's wrapped in response object (backup case)
  const errorResponse = error as {
    response?: {
      data?: ApiErrorResponse;
    };
  };

  if (
    errorResponse?.response?.data?.errors &&
    Array.isArray(errorResponse.response.data.errors)
  ) {
    // Get message from errors array (usually the first error)
    const firstError = errorResponse.response.data.errors[0];
    if (firstError?.value) {
      return firstError.value;
    }
  }

  // Check if it's a regular error response with message
  if (errorResponse?.response?.data?.message) {
    return errorResponse.response.data.message;
  }

  // Fallback for Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Default fallback
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

/**
 * Extract all error messages from API response
 * @param error - The error object from catch block
 * @returns Array of error messages
 */
export const extractAllErrorMessages = (error: unknown): string[] => {
  // First, check if error is already the response data (from axios interceptor)
  const directErrorResponse = error as ApiErrorResponse;
  if (
    directErrorResponse?.errors &&
    Array.isArray(directErrorResponse.errors)
  ) {
    return directErrorResponse.errors
      .map((err) => err.value)
      .filter((value) => value && value.trim() !== '');
  }

  // Check if it's wrapped in response object (backup case)
  const errorResponse = error as {
    response?: {
      data?: ApiErrorResponse;
    };
  };

  if (
    errorResponse?.response?.data?.errors &&
    Array.isArray(errorResponse.response.data.errors)
  ) {
    return errorResponse.response.data.errors
      .map((err) => err.value)
      .filter((value) => value && value.trim() !== '');
  }

  // Return single message as array
  return [extractErrorMessage(error)];
};
