import { useLayoutEffect } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const [signout] = useRequest({
    url: "/api/users/signout",
    method: "POST",
    onSuccess: () => Router.push("/"),
  });

  useLayoutEffect(() => {
    signout();
  }, []);

  return null;
};

export default Signout;
