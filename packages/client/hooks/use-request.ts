import { useState, useCallback } from "react";
import { ErrorMessage } from "@ticketing/auth/src/middleware/error-handler";

export function useRequest<T>(
  url: string,
  method: "GET" | "POST"
): [(body?: object) => Promise<T>, T | null | undefined, ErrorMessage[]] {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [data, setData] = useState<T>(null);

  const request = useCallback(
    async (body?: object | string) => {
      try {
        const response: T = await fetch(url, {
          method,
          body: body
            ? typeof body === "string"
              ? body
              : JSON.stringify(body)
            : null,
        }).then((res) => res.json());

        setData(response);
        return response;
      } catch (err) {
        console.log({
          err,
        });
        setErrors([]);
      }
    },
    [url, method]
  );

  return [request, data, errors];
}
