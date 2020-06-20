import "bootstrap/dist/css/bootstrap.css";
import { AppProps, AppContext } from "next/app";
import buildClient from "../api/build-client";
import { Header } from "../components/header";

export interface CurrentUserData {
  userId: string;
  email: string;
  iat: number;
}

interface Props extends AppProps {
  currentUser: CurrentUserData;
}

const AppComponent = ({ Component, pageProps, currentUser }: Props) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (
  appContext: AppContext
): Promise<{ currentUser?: CurrentUserData; pageProps: any }> => {
  const client = buildClient(appContext.ctx);
  const data: {
    currentUser: {
      userId: string;
      email: string;
      iat: number;
    };
  } = await client.get("/api/users/currentuser");
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
