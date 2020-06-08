import { useState, useCallback } from "react";
import {
  ErrorMessage,
  ErrorResponse,
} from "@ticketing/auth/src/middleware/error-handler";

export function useRequest<T>(
  url: string,
  method: "GET" | "POST"
): [(body?: object) => Promise<T>, T | null | undefined, ErrorMessage[]] {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [data, setData] = useState<T>(null);

  const request = useCallback(
    async (body?: object): Promise<T | undefined> => {
      setErrors([]);
      setData(null);

      try {
        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: T | ErrorResponse = await response.json();

        if (isErrorResponse(data)) {
          setErrors(data.errors);
        } else {
          setData(data);
          return data;
        }
      } catch (err) {}
    },
    [url, method]
  );

  return [request, data, errors];
}

function isErrorResponse(data: any): data is ErrorResponse {
  return Array.isArray(data?.errors);
}
