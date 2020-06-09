import "bootstrap/dist/css/bootstrap.css";
import { AppProps, AppContext } from "next/app";
import buildClient from "../api/build-client";
import { Router } from "next/router";

interface CurrentUserData {
  userId: string;
  email: string;
  iat: number;
}

interface Props extends AppProps {
  currentUser: {
    id: string;
    email: string;
    iat: number;
  };
}

const AppComponent = ({ Component, pageProps, currentUser }: Props) => {
  return (
    <div>
      <h1>Header! {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (
  appContext: AppContext
): Promise<{ currentUser?: CurrentUserData; pageProps: any }> => {
  const data: {
    currentUser: {
      userId: string;
      email: string;
      iat: number;
    };
  } = await buildClient(appContext.ctx).get("/api/users/currentuser");
  let pageProps: any = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
