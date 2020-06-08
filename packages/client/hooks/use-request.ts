import { useState, useCallback } from "react";
import {
  ErrorMessage,
  ErrorResponse,
} from "@ticketing/auth/src/middleware/error-handler";

interface UseRequest<T> {
  url: string;
  method: "GET" | "POST";
  onSuccess?: (data: T | undefined) => void;
}

type UseRequestReturn<T> = [
  (body?: object) => Promise<T>,
  T | null | undefined,
  ErrorMessage[]
];

export function useRequest<T>({
  url,
  method = "GET",
  onSuccess,
}: UseRequest<T>): UseRequestReturn<T> {
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
          throw data.errors;
        } else {
          setData(data);
          onSuccess && onSuccess(data);
          return data;
        }
      } catch (err) {
        setErrors(err);
      }
    },
    [url, method]
  );

  return [request, data, errors];
}

function isErrorResponse(data: any): data is ErrorResponse {
  return Array.isArray(data?.errors);
}
