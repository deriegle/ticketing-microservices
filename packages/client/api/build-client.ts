import { NextPageContext } from "next";

export default ({ req }: NextPageContext) => {
  if (typeof window === "undefined") {
    return {
      get: async (url: string) => {
        const res = await fetch(
          `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${url}`,
          {
            method: "GET",
            headers: {
              Host: req?.headers?.host,
              Cookie: req?.headers?.cookie,
            },
          }
        );

        return res.json();
      },
      post: async (url: string, body?: object) => {
        const res = await fetch(
          `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${url}`,
          {
            method: "POST",
            headers: {
              Host: req?.headers?.host,
              Cookie: req?.headers?.cookie,
            },
            body: body ? JSON.stringify(body) : null,
          }
        );

        return res.json();
      },
    };
  } else {
    return {
      get: async (url: string) => {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Host: req?.headers?.host,
            Cookie: req?.headers?.cookie,
          },
        });

        return res.json();
      },
      post: async (url: string, body?: object) => {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Host: req?.headers?.host,
            Cookie: req?.headers?.cookie,
          },
          body: body ? JSON.stringify(body) : null,
        });

        return res.json();
      },
    };
  }
};
